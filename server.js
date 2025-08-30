import { gotScraping } from 'got-scraping';
import fs from 'fs';

// --- CONFIGURATION ---
// Updated with the new cookie you provided.
const ADIDAS_COOKIE = 'mt.v=1.080034733.1756416230284; channelflow=nonpaid|other|1759008230327; channeloriginator=nonpaid; channelcloser=nonpaid; x-browser-id=544bc3ee-f9c7-4b45-8d23-89cd66ac9a06; ab_qm=b; mt.v=1.080034733.1756416230284; x-commerce-next-id=8152dbc7-5ac3-43a7-9166-bcfd438a3123; notice_preferences=%5B0%2C1%2C2%5D; _ga=GA1.1.1406469314.1756416233; _gcl_au=1.1.2040929066.1756416238; _fbp=fb.2.1756416238351.13268577135267497; lantern=a792fc95-d542-4b29-9c7e-0180455897aa; _pin_unauth=dWlkPVlqTTJOakV6WVdRdFl6RXhaUzAwTVRBNExXRmtZekl0TlRBeVlqVTRZMkl6T1RWaw; QuantumMetricUserID=7575ffe08878d2f3b25bf35f972c0736; _scid=vG4ot5kkT3Tr6e-WtyndxLNz5DeY8nr9; _ScCbts=%5B%5D; _sctr=1%7C1756405800000; x-commerce-next-id=8152dbc7-5ac3-43a7-9166-bcfd438a3123; __olapicU=e0403df4b0e2a63771d760c4ac3a9c77; newsletterShownOnVisit=true; gl-feat-enable=CHECKOUT_PAGES_ENABLED; geo_ip=123.201.215.166; geo_country=IN; akacd_plp_prod_adidas_grayling=3933873351~rv=51~id=c11a778a5a951e490e7a622153a04095; akacd_api_3stripes=3933873353~rv=98~id=c09375ae777e449351305bc293178a96; AMCVS_7ADA401053CCF9130A490D4C%40AdobeOrg=1; s_cc=true; x-site-locale=en_GB; x-original-host=www.adidas.co.uk; x-environment=production; x-browser-id-cs=544bc3ee-f9c7-4b45-8d23-89cd66ac9a06; x-session-id=4c85e4dc-e282-4d2a-9da1-24a22abfa746; wishlist=%5B%5D; UserSignUpAndSave=7; UserSignUpAndSave=7; QSI_SI_0evq2NrkQkQaBb7_intercept=true; geo_coordinates=lat=18.53, long=73.87; AKA_A2=A; bm_ss=ab8e18ef4e; AMCV_7ADA401053CCF9130A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C20331%7CMCMID%7C16887573550114692721046222974872699291%7CMCAAMLH-1757021032%7C12%7CMCAAMB-1757188478%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1756590878s%7CNONE%7CMCAID%7CNONE; mt.sc=%7B%22i%22%3A1756583679009%2C%22d%22%3A%5B%5D%7D; tfpsi=f4c2056d-7910-4d46-9ad4-a465c812d17b; bm_sc=4~2~511267424~YAAQ5gFAF2KjT+GYAQAAuu+L/AVjBuUp1hjJ5Pd126M5IIc7m7qBHUl+WPNbBoxCV2yUD0bi3UBzsMUL41n6738LbfIzrwfot305xD4zGq/esztcVevD0B4GvpNC0oCTubZOFesHVIJFvvy6VQdWHfnY0yTnKnSpdTXmUwEFhd9Vwr0WpKcK3rLwl1ag/fgmCx0BYF047oBoBMNQxUVw57/ieKnffIsfJgLY3m7DWXhlra+O+atzvAaBgRA0jlQq72UiQ7Q2hTW2JgBumFJq4eZkjP21heR32XBsvaHO8wronxsQAB1L/VkZI0cooq7fIHJ1kucDQVs4MQsE6/QS6Ns+fO4DXLQ9g0ozLZGCTgbMzrzsHszt+/lO4/ZxjYqlx7jPxlGpsHENATjCPkwN2/EzTEwijX310MqvCT/NlEjzLBCoCJvU+SBsW+mVb9jD3L5321yxK2YLmxA9beEqwCLsMa6a4r1E1gtlZWcKNcanMvOla52yYkkdz/ZITpRWn4jA7sHDs7vlKMnwtKqur9pX5AebNLo9WDb6kwEyAkKFM5IRu8ZKqyoW4+DshHDQENKJRgRSPTGwcrfwFsRpOVOLmLPxAxCL7F1Y39mZfCa3D4EMog743IsJ1MaEzo7AqKi+LeLXUYTW0vVihCymAucz8QWBLWs=; QuantumMetricSessionID=b6fa1adea9370c1ac37736adc4d1353e; bm_so=001F0B47191206A790B594C8195F0586A78DEE71FEE8475ED280B833DF8FE905~YAAQ5gFAF9mtT+GYAQAAQtWO/AQ8Og1bvpextVNKx7k8h8kxe8P5/IR4abXJMcvsJ9JTXKI+6b+bX2LhrU5FQ6/kcK4kYGWxKiA9VPqsj4D6xK/tWwww946gMsBxu+aGHKKp54bc14O4U8y03ACSpjVj80DpxgOoI530U7hG7jW2Nve/2hYBiT8DCPXYhdpkkTU4tcZaOq9mS/cHG3RQM/hUFVSwnYhJHMLcAU6y0tUUb5kHGUHYNarZ1kQy2r/ZgtCMhkEFPJ70VIG9VBlhvW3XbQe9xaNC6MNOkqCc+JaHN3P/vIUzm8H0VRZziu+NqFt2pvqTvfwVO3JrJi3Di1RpDo6lTDBe/6EFPdJXvJxdwiyDAFzqDfJXnBseyPudY0fsbSBR2cF6Gz3RDxv+WWfGQIuDkkeVUtJxY25gMTS8x3g0aB/MNRks4HD1oEzMFUzDMHNLim9DnQ9mc8E=; bm_lso=001F0B47191206A790B594C8195F0586A78DEE71FEE8475ED280B833DF8FE905~YAAQ5gFAF9mtT+GYAQAAQtWO/AQ8Og1bvpextVNKx7k8h8kxe8P5/IR4abXJMcvsJ9JTXKI+6b+bX2LhrU5FQ6/kcK4kYGWxKiA9VPqsj4D6xK/tWwww946gMsBxu+aGHKKp54bc14O4U8y03ACSpjVj80DpxgOoI530U7hG7jW2Nve/2hYBiT8DCPXYhdpkkTU4tcZaOq9mS/cHG3RQM/hUFVSwnYhJHMLcAU6y0tUUb5kHGUHYNarZ1kQy2r/ZgtCMhkEFPJ70VIG9VBlhvW3XbQe9xaNC6MNOkqCc+JaHN3P/vIUzm8H0VRZziu+NqFt2pvqTvfwVO3JrJi3Di1RpDo6lTDBe/6EFPdJXvJxdwiyDAFzqDfJXnBseyPudY0fsbSBR2cF6Gz3RDxv+WWfGQIuDkkeVUtJxY25gMTS8x3g0aB/MNRks4HD1oEzMFUzDMHNLim9DnQ9mc8E=^1756583880707; s_pers=%20pn%3D1%7C1759010906179%3B%20s_vnum%3D1756665000667%2526vn%253D5%7C1756665000667%3B%20s_invisit%3Dtrue%7C1756585681653%3B; _rdt_uuid=1756416237986.12d4ea33-2dec-44ca-85e2-9701dc736653; _scid_r=zO4ot5kkT3Tr6e-WtyndxLNz5DeY8nr9chHqGQ; _uetsid=cef05d20857c11f0be73650d41d6a082|5yfuwi|2|fyw|0|2066; _uetvid=4f3170b0845511f0989f6f3a9712cb8d|12rraei|1756583884022|6|1|bat.bing.com/p/insights/c/k; bm_sz=A349DC41BDF761A22D379446789DC7C5~YAAQ5gFAF6euT+GYAQAAHCCP/Bw80M9iec5iZ+4edH0Ssc2KLAYVZhM+o3kUHapw57AcvTiTOmvvgXK7Puvi80RO1pNuwDbFRcpGLyprDGC4sjtV2HIHOckWDf8oX5MfROnONOF6l0JGwrAKxrAbxoaHUmW8VM+YgyUB57X7J4acWrN+5OiEFM5GxDvcMJLBtAq6b9pYhwYjyMUR+u3BxGRSwZDjTOoNXUw9aIjlQvOMLJcpMN3apFzZh5jjx68oGN0QosgI3YLASaWdH1URf4SIWXpC9ePJOBWu5C6RHDTMy2pTxTaP1FfqpAZ+PEM5/H6DXJPITeVsABHLLn34n23Y5MF9/HZAKMBbFl5MB8x5y6fMK7mWzrWg7ZmmBC/bf8cUkQHL/J3bQkugU/ruO1kZaRaYrjgs8wdZ2NcomkotkDA473cAucK+httlsicoJ9YguURzkFWvLcuC3qetZc/o~4273729~3228740; _ga_4DGGV4HV95=GS2.1.s1756583629$o5$g1$t1756583897$j45$l0$h0; ak_bmsc=9FA0F3977BCBF7D2183E3C4B2955E1F3~000000000000000000000000000000~YAAQ5gFAF9iuT+GYAQAAlCqP/Bw/5StmuTsib+KU4FftERBwNmazdDA077ZSyU4vxERrMmcJJSlkAs+MsxxkmLZbYiswT0WshpmfdfuX5CtzU6KU815RH9Km/AJrPc/+2W+x6a43nz0LeL+jBQ4e9eZy7GN+ZX4MhZ0FN5N9lIaq54bG3Ko81Yjz63CFJOx4LZ0mW8C92F9e8EoEUi6IPCEvRWqaCsLorFWiIMIYxdqImxB4uo7YNlFWv28rg60f2PWb5rCRO1RowM2vTXlUzNUduSlCbFXbcOMVDbj/kK6KK+6a0aG86IWPSxu04L/nFMLHipH47B4ZBjamfXjZz5/BSpRrG5KN8WgKc/Q5nQKumcNjwCGm480wNIJtJhaavnd/riwR8Ggd5ysR; utag_main=v_id:0198f290c3a400290d88e4683d1e0506f001906700b5e$_sn:5$_se:6%3Bexp-session$_ss:0%3Bexp-session$_st:1756585701273%3Bexp-session$ses_id:1756583672271%3Bexp-session$_pn:6%3Bexp-session$_vpn:26%3Bexp-session$ttdsyncran:1%3Bexp-session$dcsyncran:1%3Bexp-session$dc_visit:1$dc_event:26%3Bexp-session$ttd_uuid:e9e67707-44f2-4a6f-89eb-05f55aa0210f%3Bexp-session$cms_514:1%3Bexp-session$_prevpage:PRODUCT%7CADI%2024%20AEROREADY%20FOOTBALL%20KNEE%20SOCKS%20(IM8922)%3Bexp-1756587481473; RT="z=1&dm=www.adidas.co.uk&si=9be64d77-b47c-459e-a003-2844e2289186&ss=meyoklr3&sl=4&tt=11f7&bcn=%2F%2F684d0d43.akstat.io%2F"; forterToken=4b97f553a56d41468a5a9a03b2699433_1756583897948__UDF43_17ck_XNRWHo1VW5Y%3D-2899-v2; forterToken=4b97f553a56d41468a5a9a03b2699433_1756583897948__UDF43_17ck_XNRWHo1VW5Y%3D-2899-v2; bm_s=YAAQ5gFAFwavT+GYAQAAgTaP/AN2tUTPOvWgzT829i/6srB9dACk4q4uA9CoiANq3c2OZs2XrCFfVOm98Ozpdk0hxW4v25zK3NXbilKs9qMissvPxGs2+bmikhlBB+mRU88VeYD5dvlV0yusThQw3zjsx0z4O2XqEEuavSMgTd5ar33vU3Ne5/iyfyCMPi8BpaDZl+BTnqi7G6B0HnCJdsaJyk7xXnIOw1lvx2PEc1Z7T2RjGDJoeCQ5z4nMZBQ4tWkPCKgf+2cnfKYL7YYv1r3UmO+NPRQBkoX3uG55mNAwc/dQTV3qJeDdzKRGZQEBNJWRkfKeXfjJWk0z0VTuE8ceXrmsNOQA0VaIMgm/WItdYesF/KIuDv7Zvy/Ti44bputSk3TrrayvHhk/j+4i12axv5oA767Ij2NixO0OaoJ3mfezCJ0Yxs1ghCL4UGOJtOwHq/XaDVJZLB3m7NhJeSEFiiRiS1lDnxRbC4Y4d+inkXncrOmmNXzUjGrik0dSLSceia30lURZKDvZb2Scp2p5J6wCnATcE2/G/3QKS3Km7Yj6QA7IuWfGuV31+dqmJ+O3; _abck=39FED2A4FFD5832C052293FBB520A541~-1~YAAQ5gFAFxavT+GYAQAAEDmP/A6TqA4C8rM10Go6lh4Qv/S9x7vXQBesiGyGxb8OCdnGeV2+ECE6wu3jeoYzjrUK2ZIj64yEzRhm2gWpYN9d4Fg3FM1ven7rYjKx4tq7UbR/B+dyOoj19b4fJAuiQS9Q8p49ZyBvmhjrDgN09w8+uCTQJCSuy3Qktss+giAa5RmzkfI2E3ImwC/82cQozQBCT88LM5nVNtsS2gcdup+DRorPMZ588iTYQB2PxFi/RY6Vgq/rtFCNMlzPV0vThSlx6XgfPpQqT891t32SwlFyJ5e9flmliOdB5qdC2KqFaLcnZHFI7Za2Yxsye/8Yjd2gSKl9NfLV6wdykEtUbHKX0Mx7JZS7DE4gmmuxo0nwcbGX2dSlchgT9hPNkDVPZNmc3mzi9nHml32tvH+RYvw5mt22WmP3myYFdlwcuyJvRvIZOY7c32nN5eMlYeVdvpEmYo3UPy8dafOjqYF46VKLEKx+Vv+fbfaPFsRGjh+cxnmu4xTISkYjY+jw4m9TqiGi93Tdndcb4cikrFILMNzc3VR++Gaxlh2+GT3ZqEh5duzLtcUNUc3Frd7nbVso9bOu2t2jooQe3Wzzxnt5qr3emnYwuJ8rJtvf1RantEENay7LDh/YuwxquxuWgJyIZkpplC167+Xezcn15DN31d2gK/6eTzHBAMWaPOo7YOddhAj2VqgTul2oycTcEwGwVKq1SF1jQ3nA8EYYuWi2Yvt2wjB2QBtp6A+X~-1~-1~1756587267~AAQAAAAE%2f%2f%2f%2f%2f+UFRWi+q2ut7%2f7%2fji9bSlWeIEpAGVjXhi%2fcpnKa792agZ+1ek5RLq%2ffSkrkKMlpELocomcl63sS5pxYO81n+qICZD1hXVsa48WpgsecCiIMyhpf1jgMC0Q98UmaTRLclAsOBGw%3D~1756583961';

// Helper function for delays
const randomDelay = (min, max) => new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

// HTML generation function
function generateProductHtml(product, variationList) {
    if (!variationList) {
        return `
          <div class="product-card error">
            <h2>${product.productId} (Failed)</h2>
            <p><strong>URL:</strong> <a href="${product.productUrl}" target="_blank">${product.productUrl}</a></p>
            <p class="error-message"><strong>Error:</strong> Could not find product data. The page may be blocked or its structure might have changed.</p>
          </div>
        `;
    }

    let variationsHtml = '<tr><td colspan="3">No variations or sizes found for this product.</td></tr>';

    if (variationList && variationList.length > 0) {
        variationsHtml = variationList.map(item => `
            <tr class="${item.availability > 0 ? 'in-stock' : 'out-of-stock'}">
                <td>${item.sku}</td>
                <td>${item.size}</td>
                <td>${item.availability}</td>
            </tr>
        `).join('');
    }

    return `
        <div class="product-card">
          <h2>${product.productId}</h2>
          <p><strong>URL:</strong> <a href="${product.productUrl}" target="_blank">${product.productUrl}</a></p>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Size</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              ${variationsHtml}
            </tbody>
          </table>
        </div>
    `;
}

// Main scraping logic
async function main() {
    console.log("Starting advanced scraper with browser impersonation...");

    const products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Adidas Product Availability Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
        h1 { text-align: center; color: #333; }
        .container { max-width: 900px; margin: auto; }
        .product-card { background: #fff; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .product-card h2 { margin-top: 0; color: #007bff; }
        .product-card.error h2 { color: #dc3545; }
        .error-message { color: #dc3545; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8f9fa; }
        .out-of-stock { color: #dc3545; background-color: #f9e9e9; }
        .in-stock { color: #28a745; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Adidas Product Availability Report - ${new Date().toLocaleString()}</h1>
  `;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        console.log(`[${i + 1}/${products.length}] Fetching page for: ${product.productId} at ${product.productUrl}`);

        try {
            const response = await gotScraping({
                url: product.productUrl,
                headers: {
                    'cookie': ADIDAS_COOKIE,
                },
                timeout: { request: 30000 },
                retry: { limit: 2 }
            });

            const html = response.body;

            const regex = /<script>window\.__INITIAL_STATE__\s*=\s*({.*?});<\/script>/;
            const match = html.match(regex);

            if (!match || !match[1]) {
                throw new Error("Could not find __INITIAL_STATE__ JSON in the page source.");
            }

            const initialState = JSON.parse(match[1]);
            const variationList = initialState?.product?.product?.variationList;

            htmlContent += generateProductHtml(product, variationList);

        } catch (error) {
            let errorMessage = error.message;
            if (error.response) {
                errorMessage = `Request failed with status ${error.response.statusCode} (${error.response.statusMessage})`;
            }
            console.error(` -> Failed for ${product.productId}: ${errorMessage}`);
            htmlContent += generateProductHtml(product, null);
        }

        await randomDelay(1500, 3000);
    }

    fs.writeFileSync('availability_report_detailed.html', htmlContent);
    console.log("\nScraping complete! Report saved to availability_report_detailed.html");
}

main();