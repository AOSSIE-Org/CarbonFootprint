const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const mapsData = require("./maps.json")
let page;
let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false, // extensions only supported in full chrome.
    args: [
      `--disable-extensions-except=${CRX_PATH}`,
      `--load-extension=${CRX_PATH}`
    ]
  });
  page = await browser.newPage();
});

afterAll(() => {
  browser.close();
});


mapsData.forEach(site => {
  describe(site.name, () => {
    const mapsUrl = site.url;

    test("a div with class carbon exists", async () => {
      await page.goto(mapsUrl, {waitUntil: 'load', timeout: 0});
      await page.waitForSelector(".carbon");
      const carbonEl = await page.$eval(".carbon", el => (el ? true : false));
      expect(carbonEl).toBe(true);
    }, 170000);
    
    test("carbon div shows correct carbon emission data", async () => {
      await page.waitForSelector(".carbon");
      const emission = await page.evaluate(() => {
        let data;
        const dataEl = document.querySelector(".carbon");
        return dataEl.innerText;
      });
  
      expect(emission).toBe(site.emission);
    }, 17000);
  });
});








// describe("Google Maps", () => {
//   const mapsUrl =
//     "https://www.google.com/maps/dir/19.8208305,85.821988/19.8147322,85.8603566/@19.812352,85.8333184,15z";
  
//   test("a div with class carbon exists", async () => {
//     await page.goto(mapsUrl, {waitUntil: 'load', timeout: 0});
//     await page.waitForSelector(".carbon");
//     const carbonEl = await page.$eval(".carbon", el => (el ? true : false));
//     expect(carbonEl).toBe(true);
//   }, 170000);
  
//   test("carbon div shows correct carbon emission data", async () => {
//     await page.waitForSelector(".carbon");
//     const emission = await page.evaluate(() => {
//       let data;
//       const dataEl = document.querySelector(".carbon");
//       return dataEl.innerText;
//     });

//     expect(emission).toBe("1.43 kg CO2");
//   }, 17000);
// });
