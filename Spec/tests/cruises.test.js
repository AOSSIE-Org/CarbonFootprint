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



// --------------TESTS---------------------
test("Orbitz", async () => {
  const data = cruisesData.orbitz;
  const page = await browser.newPage();
  await blockImages(page)
  await page.goto(data.url.split('|').join(`${currYear}-${currMonth}-${today}`) , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Orbitz Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("Expedia Cruise", async () => {
  const data = cruisesData.expedia;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${currYear}-${currMonth}-${today}`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Expedia Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("Priceline Cruise", async () => {
  const data = cruisesData.priceline;
  const page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Priceline Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("Tours4Fun Cruise", async () => {
  const data = cruisesData.tours4fun;
  const page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Tours4Fun Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("Celebritycruises Cruise", async () => {
  const data = cruisesData.celebritycruises;
  const page = await browser.newPage();
  await blockImages(page)
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 70000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Celebritycruises Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 100000);

test("silversea Cruise", async () => {
  const data = cruisesData.silversea;
  const page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("silversea Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("cruisedirect Cruise", async () => {
  const data = cruisesData.cruisedirect;
  const page = await browser.newPage();
  await blockImages(page)
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("cruisedirect Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("carnival Cruise", async () => {
  const data = cruisesData.carnival;
  const page = await browser.newPage();
  await blockImages(page)
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("carnival Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("cruisedotcom Cruise", async () => {
  const data = cruisesData.cruisedotcom;
  const page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("cruisedotcom Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("seahub Cruise", async () => {
  const data = cruisesData.seahub;
  const page = await browser.newPage();
  await blockImages(page)
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});
  await page.waitFor("input#jbtSearchBarSubmitInput")
  await page.click("input#jbtSearchBarSubmitInput")
  await page.waitForSelector('span[data-text-mobile="Date"]', {timeout: 700000})

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("seahub Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("tripadvisor Cruise", async () => {
  const data = cruisesData.tripadvisor;
  const page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("tripadvisor Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("cruisenation Cruise", async () => {
  const data = cruisesData.cruisenation;
  const page = await browser.newPage();
  await blockImages(page)
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});
  
  const dateLabelSelector = 'label[for="search-bar__form--monthyear"]'
  const monthSelector = 'li[aria-selected="false"]'
  const searchButton = 'button#home-search-btn-tracking';
  await page.waitForSelector(dateLabelSelector, {timeout: 60000})
  
  await page.click(dateLabelSelector)
  
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")

  await page.click(searchButton)

  await page.waitFor('#carbon', {timeout: 130000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("cruisenation Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 140000);

