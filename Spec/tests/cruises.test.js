const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const cruisesData = require("./cruises.json")
const {currMonth, currYear, today} = require("../helpers/dateHelper")
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



// --------------TESTS---------------------
test("Orbitz", async () => {
  const data = cruisesData.orbitz;
  let page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${currYear}-${currMonth}-${today}`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Orbitz Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("Expedia Cruise", async () => {
  const data = cruisesData.expedia;
  let page = await browser.newPage();
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
  let page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Priceline Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("Tours4Fun Cruise", async () => {
  const data = cruisesData.tours4fun;
  let page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Tours4Fun Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("Celebritycruises Cruise", async () => {
  const data = cruisesData.celebritycruises;
  let page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Celebritycruises Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("silversea Cruise", async () => {
  const data = cruisesData.silversea;
  let page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("silversea Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("cruisedirect Cruise", async () => {
  const data = cruisesData.cruisedirect;
  let page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("cruisedirect Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("cruisewatch Cruise", async () => {
  const data = cruisesData.cruisewatch;
  let page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("cruisewatch Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("carnival Cruise", async () => {
  const data = cruisesData.carnival;
  let page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("carnival Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("cruisedotcom Cruise", async () => {
  const data = cruisesData.cruisedotcom;
  let page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("cruisedotcom Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("travelocity Cruise", async () => {
  const data = cruisesData.travelocity;
  let page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("travelocity Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("kayak Cruise", async () => {
  // website is blocking bots
  const data = cruisesData.kayak;
  let page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 800,
    deviceScaleFactor: 1,
});
  await page.goto(data.url.split("|").join(`${currYear}-${currMonth}`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("kayak Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("tirun Cruise", async () => {
  const data = cruisesData.tirun;
  let page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("tirun Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

