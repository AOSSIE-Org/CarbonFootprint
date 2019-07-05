const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const flightsData = require("./flights.json")
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

// Get current Month and Year
var currDate = new Date()
var nextMonth = currDate.getMonth() + 2;
var year = currDate.getFullYear();
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

if(nextMonth === 13) {
    nextMonth = 1;
    year += 1;
}
var nextMonthName = monthNames[nextMonth - 1]
if(nextMonth <= 10) {
    // pad Month with 0. (8 -> 08)
    nextMonth = '0' + nextMonth
}


// --------------TESTS---------------------
test("Sky Scanner", async () => {
    // Extension not working
    const data = flightsData.skyscanner;
    let page = await browser.newPage();
    await page.goto(data.url.split('|').join(`${year%100}${nextMonth}01`) , {waitUntil: 'load', timeout: 0});
  
    await page.waitFor('#carbon');
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Sky Scanner Emission: ", emissionFloat) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 50000);

test("Cleartrip Fligts", async () => { //working and tests passing
  const data = flightsData.cleartrip;
  let page = await browser.newPage();
  await page.goto(data.url.split('|').join(`01/${nextMonth}/${year}`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Cleartrip Fligts Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("Hipmunk Flights", async () => {
    //Extension is Not working
    const data = mapsData.hipmunk;
    let page = await browser.newPage();
    await page.goto(data.url.split('|').join(`${year}-${nextMonth}-01`), {waitUntil: 'load', timeout: 0});
  
    await page.waitFor('#carbon');
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Hipmunk Emission: ", emissionFloat) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
  }, 50000);

test("Makemytrip Fligts", async () => {
    //extension not working
  const data = flightsData.makemytrip;
  let page = await browser.newPage();
  await page.goto(data.url.split('|').join(`01/${nextMonth}/${year}`), {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Makemytrip Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("Google Flights", async () => {
    //extension not working on some websites
  const data = flightsData.googleflights;
  let page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${year}-${nextMonth}-01;`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Google Flights Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("Expedia Flights", async () => { // working and tests passing
  const data = flightsData.expedia;
  let page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${nextMonth}%2F01%2F${year}`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Expedia Flights Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);

test("Tripadvisor Flights", async () => {
    // Extension not working
    const data = flightsData.tripadvisor;
    let page = await browser.newPage();
    await page.goto(data.url.split('|').join(`${year}${nextMonth}01`) , {waitUntil: 'load', timeout: 0});
  
    await page.waitFor('#carbon');
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Tripadvisor Flights Emission: ", emissionFloat) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 50000);

test("United Flights", async () => { //working and tests passing
    const data = flightsData.united;
    let page = await browser.newPage();
    await page.setViewport({
        width: 1000,
        height: 800,
        deviceScaleFactor: 1,
    });
    await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});
    
    // ---simulate human interaction---
    var onewaySelector = 'label[for="oneway"]'
    var originSelector = 'input#bookFlightOriginInput'
    var originLabelSelector = 'button[aria-label="Delhi, IN (DEL)"]'
    var destinationSelector = 'input#bookFlightDestinationInput'
    var destinationLabelSelector = 'button[aria-label="New York, NY, US (NYC - All Airports)"]'
    var dateSelector = 'input#DepartDate'
    var submitButtonSelector = 'form#bookFlightForm button[type="submit"]'
    
    await page.waitForSelector(onewaySelector)
    await page.click(onewaySelector)
    
    await page.waitForSelector(originSelector)
    await page.click(originSelector)
    await page.keyboard.type('Delhi');
    await page.waitForSelector(originLabelSelector)
    await page.click(originLabelSelector)
    
    await page.click(destinationSelector)
    await page.keyboard.type('New Yor');
    await page.waitForSelector(destinationLabelSelector)
    await page.click(destinationLabelSelector)
    
    await page.click(dateSelector)
    const dateValue = await page.$eval(dateSelector, el => el.value);
    for (let i = 0; i < dateValue.length; i++) {
        await page.keyboard.press('Backspace');
    }
    await page.keyboard.type(nextMonthName + ' 01');
    await page.keyboard.press('Enter');
    await page.click(submitButtonSelector)
    
    // ----perform test----
    await page.waitFor('#carbon');
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("United Flights Emission: ", emissionFloat) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 100000);
  