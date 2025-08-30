// index.js (ES module) - Playwright scraper that reads product_codes.json (productId -> url)
import express from "express";
import fs from "fs";
import { chromium } from "playwright";

const PORT = process.env.PORT || 3000;
const app = express();

// Load product codes file (format: {"JP9997": "https://.../JP9997.html", ...})
let productMap = {};
try {
  const raw = fs.readFileSync("./product_codes.json", "utf8");
  const parsed = JSON.parse(raw);
  // Accept either object mapping or { products: [ { productId, url } ] } fallback
  if (Array.isArray(parsed.products)) {
    parsed.products.forEach(p => { if (p.productId && p.url) productMap[p.productId] = p.url; });
  } else if (typeof parsed === "object" && parsed !== null) {
    productMap = parsed;
  }
  console.log(`Loaded ${Object.keys(productMap).length} products from product_codes.json`);
} catch (e) {
  console.warn("product_codes.json not found or invalid — bulk endpoint will return error.");
}

// small helper: wait and retry
async function retry(fn, attempts = 3, delayMs = 800) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i + 1 < attempts) await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

// Capture availability response using waitForResponse
async function fetchAvailabilityFromPage(page, productId, apiTimeout = 15000) {
  const apiPath = new RegExp(`/api/products/${productId}/availability`, "i");
  // start waitForResponse before navigation/trigger (so we don't miss it)
  const responsePromise = page.waitForResponse(resp => {
    try {
      return resp.url().match(apiPath) && resp.status() < 500;
    } catch (e) {
      return false;
    }
  }, { timeout: apiTimeout });

  // If page already loaded, we can still fetch via window.fetch from page context as fallback
  // But primary approach is to navigate to the product page and let page's scripts call the API.
  // Caller should have navigated to the product page first.

  const resp = await responsePromise;
  const status = resp.status();
  const text = await resp.text();
  try {
    return { status, json: JSON.parse(text) };
  } catch (e) {
    return { status, raw: text };
  }
}

// Single-product endpoint for quick testing
// Example: /scrape?productId=JP9997&productUrl=https://www.adidas.co.uk/.../JP9997.html
app.get("/scrape", async (req, res) => {
  const { productId, productUrl } = req.query;
  if (!productId || !productUrl) return res.status(400).json({ error: "Missing productId or productUrl" });

  let browser;
  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
    });

    const page = await context.newPage();

    // Navigate to the product page first (gives cookies / sets up XHR)
    await page.goto(productUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
    // small wait for late JS to run
    await page.waitForTimeout(800);

    // Try capture API response with retry
    const result = await retry(() => fetchAvailabilityFromPage(page, productId), 2, 600);

    await browser.close();
    return res.json({ productId, productUrl, fetched: true, result });
  } catch (err) {
    if (browser) await browser.close();
    console.error("Scrape error:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "scrape_failed", details: err && err.message ? err.message : String(err) });
  }
});

// Bulk endpoint: iterate over productMap entries sequentially and return array of results
app.get("/availability", async (req, res) => {
  const productIds = Object.keys(productMap);
  if (!productIds.length) return res.status(400).json({ error: "product_codes.json not found or empty" });

  let browser;
  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
    });
    const page = await context.newPage();

    const results = [];

    for (const productId of productIds) {
      const productUrl = productMap[productId];
      try {
        // navigate to product page
        await page.goto(productUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.waitForTimeout(800);

        // capture availability response
        const result = await retry(() => fetchAvailabilityFromPage(page, productId, 15000), 2, 500);
        results.push({ productId, productUrl, ok: true, result });
      } catch (err) {
        console.error(`Error for ${productId}:`, err && err.message ? err.message : err);
        results.push({ productId, productUrl, ok: false, error: err && err.message ? err.message : String(err) });
      }
    }

    await browser.close();
    return res.json(results);
  } catch (err) {
    if (browser) await browser.close();
    console.error("Bulk error:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "bulk_failed", details: err && err.message ? err.message : String(err) });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Scraper service running on http://localhost:${PORT}`));
