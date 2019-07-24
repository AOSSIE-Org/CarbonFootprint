const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const mapsData = require("./maps.json")
let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false, // extensions only supported in full chrome.
    args: [
      '--no-sandbox',
      `--disable-extensions-except=${CRX_PATH}`,
      `--load-extension=${CRX_PATH}`
    ]
  });

  pages = await browser.pages();
  pages[0].close();
});

afterAll(() => {
  browser.close();
});

test("mapquest Maps", async () => {
  const data = mapsData.mapquest;
  let page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("mapquest Maps Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);