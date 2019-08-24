const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const cruisesData = require("./cruises.json")
const {currMonth, currYear, today, currMonthName} = require("../helpers/dateHelper")
let {blockImages} = require("../helpers/requestInterception")
let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false, // extensions only supported in full chrome.
    args: [
      '--no-sandbox',
      `--disable-extensions-except=${CRX_PATH}`,
      `--load-extension=${CRX_PATH}`
    ],
    defaultViewport: {
      width: 1600,
      height: 900,
      deviceScaleFactor: 1,
     }
  });
  
  pages = await browser.pages();
  pages[0].close();
});

afterAll(() => {
  browser.close();
});



// ---------Extension not working-------------

test("cruisewatch Cruise", async () => {
  // Message port closed before it was recieved on puppeteer
  const data = cruisesData.cruisewatch;
  const page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("cruisewatch Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("travelocity Cruise", async () => {
  // Message port closed before it was recieved on puppeteer
  const data = cruisesData.travelocity;
  const page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("travelocity Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("tirun Cruise", async () => {
  //Website Server Error
  const data = cruisesData.tirun;
  const page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("tirun Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

// -------------------BLOCKING BOTS-------------------------
test("kayak Cruise", async () => {
  // website is blocking bots
  const data = cruisesData.kayak;
  const page = await browser.newPage();
  await page.goto(data.url.split("|").join(`${currYear}-${currMonth}`) , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("kayak Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);