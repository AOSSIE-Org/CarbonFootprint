const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const flightsData = require("./flights.json")
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


// ====================BLOCKING BOTS==============================
test("United Flights", async () => { //working and tests passing
  const data = flightsData.united;
  let page = await browser.newPage();
  await blockImages(page)
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
  await page.waitFor('#carbon', {timeout: 70000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("United Flights Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 100000);

test("Amadues", async () => { // tests passing
  const data = flightsData.amadues;
  let page = await browser.newPage();
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});

  // -------SELECTORS-------------
  var onewaySelector = 'label[for="flightSearchForm.tripType.oneWay"]';
  var originLabelSelector = 'input[id="reservationFlightSearchForm.originAirport"]';
  var destinationLabelSelector = 'input[id="reservationFlightSearchForm.destinationAirport"]';
  var dateLabelSelector = 'input[id="aa-leavingOn"]';
  var submitButtonSelector = 'input[type="submit"]'
  var continueButtonSelector = "a#CLARbtnSearch";

  // ----------HUMAN INTERACTION---------------
  await page.waitForSelector(onewaySelector)
  await page.click(onewaySelector)
  
  await page.click(originLabelSelector)
  await page.keyboard.type('New York');
  
  await page.click(destinationLabelSelector)
  await page.keyboard.type('San Fransisco');
  
  await page.click(dateLabelSelector)
  const dateValue = await page.$eval(dateLabelSelector, el => el.value);
  for (let i = 0; i < dateValue.length; i++) {
    await page.keyboard.press('Backspace');
  }
  await page.keyboard.type(`01/${nextMonth}/${year}`);
  await page.keyboard.press('Enter');
  await page.click(submitButtonSelector)
  
  await page.waitForSelector(continueButtonSelector)
  await page.click(continueButtonSelector)

  // -----------PERFORM TESTS------------------------
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Amadues Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("Sky Scanner", async () => {
  // Doesn't allow bots
  const data = flightsData.skyscanner;
  let page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36');

  await page.goto(data.url.split('|').join(`${year%100}${nextMonth}01`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: "50000"});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Sky Scanner Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("priceline Fligts", async () => { //working and tests passing
  const data = flightsData.priceline;
  let page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${year}${nextMonth}01`) , {waitUntil: 'domcontentloaded', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("priceline Fligts Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);



// =================Extension not working======================
test("Makemytrip Fligts", async () => {
  //extension not working (no flight codes)
const data = flightsData.makemytrip;
let page = await browser.newPage();
await page.goto(data.url.split('|').join(`01/${nextMonth}/${year}`), {waitUntil: 'load', timeout: 0});

await page.waitFor('#carbon', {timeout: 50000});
const emission = await page.$eval("#carbon", el => el.innerText)
const emissionFloat = parseFloat(emission)
console.log("Makemytrip Emission: ", emission) 
expect(emissionFloat).toBeGreaterThan(0);
page.close();
}, 70000);


test("Delta", async () => { 
  // extension is not working
  const data = flightsData.delta;
  let page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (request) => {
      if (['image', 'font'].indexOf(request.resourceType()) !== -1) {
          request.abort();
      } else {
          request.continue();
      }
  });
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});
  
  // ---simulate human interaction---
  var originLabelSelector = 'a#fromAirportName'
  var originSelector = 'li.airport-list'

  var destinationLabelSelector = 'a#toAirportName'
  var destinationSelector = 'li.airport-list'
  
  var onewayLabelSelector = 'span[aria-owns="selectTripType-desc"]'
  var onewaySelector = 'li[data="1"]'
  
  var dateLabelSelector = 'input.calendarInput'
  var dateSelector = '.dl-datepicker-group.dl-datepicker-group-1 tbody tr + tr td a'
  
  var submitButtonSelector = 'button[type="submit"]'
  
  await page.waitForSelector(originLabelSelector)
  await page.click(originLabelSelector)
  await page.keyboard.type('DEL');
  await page.waitForSelector(originSelector)
  await page.click(originSelector)
  
  await page.click(destinationLabelSelector)
  await page.keyboard.type('NYC');
  await page.waitForSelector(destinationSelector)
  await page.click(destinationSelector)
  
  await page.click(onewayLabelSelector)
  await page.waitForSelector(onewaySelector)
  await page.click(onewaySelector)
  
  await page.click(dateLabelSelector)
  await page.waitForSelector(dateSelector)
  await page.click(dateSelector)
  
  await page.click(submitButtonSelector)
  await page.waitForSelector('table.flightResultTableHolder')
  await page.reload();
  
  // ----perform test----
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Delta Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 100000);

// test("Lufthansa Flights", async () => { 
//   //Extension not working
//   // Doesn't allow bots!
//   const data = flightsData.lufthansa;
//   let page = await browser.newPage();
//   await page.setViewport({
//       width: 1000,
//       height: 800,
//       deviceScaleFactor: 1,
//   });
//   await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});
  
//   // ---simulate human interaction---
//   var confirmCookieSelector = 'button.cm-selectSpecific'

//   var originLabelSelector = 'input[placeholder="From"]'
//   var originSelector = 'div.airport-text-code'
  
//   var destinationLabelSelector = 'input[placeholder="To"]'
//   var destinationSelector = 'div.airport-text-code'
//   // Chhatrapati Shivaji Maharaj International

//   var onewaySelector = 'input[name="isOneWay"]'
//   var dateLabelSelector = 'input[placeholder="Departure date"]'
//   var dateSelector = 'div + div.CalendarMonthGrid_month__horizontal.CalendarMonthGrid_month__horizontal_1 + div tr td[role="button"]'
//   var submitButtonSelector = 'button[type="submit"]'
  
//   console.log("waiting for button")
//   await page.waitForSelector(confirmCookieSelector)
//   await page.click(confirmCookieSelector)
//   console.log("confirmed cookeis")

  
//   await page.click(originLabelSelector)
//   await page.keyboard.type('New Delhi');
//   await page.waitForSelector(originSelector)
//   await page.click(originSelector)
  
//   await page.click(destinationLabelSelector)
//   await page.keyboard.type('Chhatrapati Shivaji Maharaj International');
//   await page.waitForSelector(destinationSelector)
//   await page.click(destinationSelector)
  
//   await page.click(onewaySelector)
  
//   await page.click(dateLabelSelector)
//   await page.waitForSelector(dateSelector)
//   await page.click(dateSelector)

//   await page.click(submitButtonSelector)
  
//   // ----perform test----
//   await page.waitFor('#carbon');
//   const emission = await page.$eval("#carbon", el => el.innerText)
//   const emissionFloat = parseFloat(emission)
//   console.log("Lufthansa Flights Emission: ", emissionFloat) 
//   expect(emissionFloat).toBeGreaterThan(0);
//   page.close();
// }, 100000);