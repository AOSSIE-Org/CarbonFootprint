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


test("Google Maps", async () => {
  const data = mapsData.googlemaps;
  let page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});
  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  expect(emission).toBe(data.emission);
  page.close();
}, 17000);

test("Open Street Maps", async () => {
  const data = mapsData.openstreetsmaps;
  let page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});
  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  expect(emission).toBe(data.emission);
  page.close();
}, 17000);

test("We Go Maps", async () => {
  const data = mapsData.wego;
  let page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});
  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  expect(emission).toBe(data.emission);
  page.close();
}, 17000);

test("Yandex Maps", async () => {
  const data = mapsData.yandex;
  let page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});
  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  expect(emission).toBe(data.emission);
  page.close();
}, 17000);
  

