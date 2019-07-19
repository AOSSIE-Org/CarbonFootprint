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
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Google Maps Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("Open Street Maps", async () => {
  const data = mapsData.openstreetsmaps;
  let page = await browser.newPage();
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
  let page = await browser.newPage();
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
  let page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Yandex Maps Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("Bing Maps", async () => {
  const data = mapsData.bing;
  let page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});

  // open directions panel
  await page.waitForSelector('a.directionsIcon')
  await page.click('a.directionsIcon')
  //type source
  await page.waitForSelector('#directionsPanelRoot > div > div.directionsInput > div.dirWaypoints > div > div > div:nth-child(1) > div > div.dirWp > input[type=text]')
  await page.click('#directionsPanelRoot > div > div.directionsInput > div.dirWaypoints > div > div > div:nth-child(1) > div > div.dirWp > input[type=text]')
  await page.keyboard.type('riyadh saudi arabia');
  await page.keyboard.press('Enter');
  //type destination
  await page.waitForSelector('#directionsPanelRoot > div > div.directionsInput > div.dirWaypoints > div > div > div:nth-child(2) > div > div.dirWp > input[type=text]')
  await page.click('#directionsPanelRoot > div > div.directionsInput > div.dirWaypoints > div > div > div:nth-child(2) > div > div.dirWp > input[type=text]')
  await page.keyboard.type('dharma saudi arabia');
  await page.keyboard.press('ArrowLeft');
  //submit
  await page.click('a.dirBtnGo.commonButton')
  
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Bing Maps Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);
  