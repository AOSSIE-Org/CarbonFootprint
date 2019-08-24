const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const mapsData = require("./maps.json")
const {DATE, currMonth, today, currYear, nextMonth, 
  yearForNextMonth, nextMonthName, currMonthName, sleep} = require("../helpers/dateHelper")
const {blockImages} = require('../helpers/requestInterception')
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
  const page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Google Maps Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("Open Street Maps", async () => {
  const data = mapsData.openstreetsmaps;
  const page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Open Street Maps Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("We Go Maps", async () => {
  const data = mapsData.wego;
  const page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("We Go Maps Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("Yandex Maps", async () => {
  const data = mapsData.yandex;
  const page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Yandex Maps Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);