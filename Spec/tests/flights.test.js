const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const flightsData = require("./flights.json")
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
    ],
    defaultViewport: {
      width: 1300,
      height: 600,
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
test("Cleartrip Fligts", async () => { //working and tests passing
  const data = flightsData.cleartrip;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`01/${nextMonth}/${yearForNextMonth}`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Cleartrip Fligts Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("Hipmunk Flights", async () => {
    const data = flightsData.hipmunk;
    const page = await browser.newPage();
    await page.goto(data.url.split('|').join(`${yearForNextMonth}-${nextMonth}-01`), {waitUntil: 'load', timeout: 0});
  
    await page.waitFor('#carbon', {timeout: 50000});
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Hipmunk Emission: ", emission) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
  }, 70000);



test("Google Flights", async () => {
  const data = flightsData.googleflights;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${yearForNextMonth}-${nextMonth}-01;`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Google Flights Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("Expedia Flights", async () => { // working and tests passing
  const data = flightsData.expedia;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`01%2F${nextMonth}%2F${yearForNextMonth}`) , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Expedia Flights Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("Spice Jet", async () => {
    const data = flightsData.spicejet;
    const page = await browser.newPage();
    await blockImages(page)
    await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});
    
    // ---simulate human interaction---
    var originLabelSelector = 'input#ControlGroupSearchView_AvailabilitySearchInputSearchVieworiginStation1_CTXT'
    var originSelector = 'a[value="DEL"]'  // Delhi
    
    var destinationLabelSelector = 'input#ControlGroupSearchView_AvailabilitySearchInputSearchViewdestinationStation1_CTXT'
    var destinationSelector = '.destination div#glsControlGroupSearchView_AvailabilitySearchInputSearchViewdestinationStation1_CTNR a[value="BOM"]' // Bombay
    
    var dateLabelSelector = 'input.custom_date_pic'
    var dateSelector = 'div.ui-datepicker-group.ui-datepicker-group-last tbody tr td a' 
    
    var submitButtonSelector = 'input.bookbtn'
    
    await page.waitForSelector(originLabelSelector, {timeout: 70000})
    await page.click(originLabelSelector)
    await page.click(originSelector)

    await page.click(destinationLabelSelector)
    await page.click(destinationSelector)

    await page.click(dateLabelSelector)
    await page.click(dateSelector)
    
    await page.click(submitButtonSelector)
    
    // ----perform test----
    await page.waitFor('#carbon', {timeout: 50000});
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Spice Jet Emission: ", emission) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 100000);

test("Kayak Flights", async () => {
  const data = flightsData.kayak;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${yearForNextMonth}-${nextMonth}-01`) , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Kayak Flights Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("Tripadvisor Flights", async () => {
  const data = flightsData.tripadvisor;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${yearForNextMonth}${nextMonth}01`) , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Tripadvisor Flights Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);