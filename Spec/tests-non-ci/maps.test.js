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
