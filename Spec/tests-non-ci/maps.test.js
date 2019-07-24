const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const mapsData = require("./maps.json")
const {sleep} = require("../helpers/dateHelper")
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

test("waze Maps", async () => {
  const data = mapsData.waze;
  let page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});
  const destLabelSelector = '.wm-search.theme-default.is-editable.is-blank'
  const destSelector = 'li[data-value="ChIJiQHsW0m3j4ARm69rRkrUF3w"]'
  const getDirectionButtonSelector = '#gtm-poi-card-get-directions'
  const origLabelSelector = 'input.wm-search__input'
  const origSelector = 'li[data-value="ChIJORy6nXuwj4ARz3b1NVL1Hw4"]'

  await page.waitForSelector(destLabelSelector)
  await page.click(destLabelSelector)
  await page.keyboard.type("Mountain View")
  await page.waitForSelector(destSelector, {visible: true})
  await page.click(destSelector)
  
  await page.waitForSelector(getDirectionButtonSelector)
  await page.click(getDirectionButtonSelector)
  
  await page.click(origLabelSelector)
  await page.keyboard.type("Palo Alto")
  await page.waitForSelector(origSelector)
  await page.click(origSelector)

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("waze Maps Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("viamichelin Maps", async () => {
  const data = mapsData.viamichelin;
  let page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("viamichelin Maps Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);