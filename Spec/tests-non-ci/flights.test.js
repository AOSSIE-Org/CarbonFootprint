const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const flightsData = require("./flights.json")
const {blockImages} = require("../helpers/requestInterception")
const {DATE, currMonth, today, currYear, nextMonth, 
  yearForNextMonth, nextMonthName, currMonthName, sleep} = require("../helpers/dateHelper")
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

// ====================BLOCKING BOTS==============================
test("United Flights", async () => { //working and tests passing
  const data = flightsData.united;
  let page = await browser.newPage();
  await blockImages(page)
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});
  
  // ---simulate human interaction---
  const onewaySelector = 'label[for="oneway"]'
  const originSelector = 'input#bookFlightOriginInput'
  const originLabelSelector = 'button[aria-label="Delhi, IN (DEL)"]'
  const destinationSelector = 'input#bookFlightDestinationInput'
  const destinationLabelSelector = 'button[aria-label="New York, NY, US (NYC - All Airports)"]'
  const dateSelector = 'input#DepartDate'
  const submitButtonSelector = 'form#bookFlightForm button[type="submit"]'
  
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
  const onewaySelector = 'label[for="flightSearchForm.tripType.oneWay"]';
  const originLabelSelector = 'input[id="reservationFlightSearchForm.originAirport"]';
  const destinationLabelSelector = 'input[id="reservationFlightSearchForm.destinationAirport"]';
  const dateLabelSelector = 'input[id="aa-leavingOn"]';
  const submitButtonSelector = 'input[type="submit"]'
  const continueButtonSelector = "a#CLARbtnSearch";

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
  await page.keyboard.type(`01/${nextMonth}/${yearForNextMonth}`);
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

  await page.goto(data.url.split('|').join(`${yearForNextMonth%100}${nextMonth}01`) , {waitUntil: 'load', timeout: 0});

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
  await page.goto(data.url.split('|').join(`${yearForNextMonth}${nextMonth}01`) , {waitUntil: 'domcontentloaded', timeout: 0});

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
await page.goto(data.url.split('|').join(`01/${nextMonth}/${yearForNextMonth}`), {waitUntil: 'load', timeout: 0});

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
  const originLabelSelector = 'a#fromAirportName'
  const originSelector = 'li.airport-list'

  const destinationLabelSelector = 'a#toAirportName'
  const destinationSelector = 'li.airport-list'
  
  const onewayLabelSelector = 'span[aria-owns="selectTripType-desc"]'
  const onewaySelector = 'li[data="1"]'
  
  const dateLabelSelector = 'input.calendarInput'
  const dateSelector = '.dl-datepicker-group.dl-datepicker-group-1 tbody tr + tr td a'
  
  const submitButtonSelector = 'button[type="submit"]'
  
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
//   const confirmCookieSelector = 'button.cm-selectSpecific'

//   const originLabelSelector = 'input[placeholder="From"]'
//   const originSelector = 'div.airport-text-code'
  
//   const destinationLabelSelector = 'input[placeholder="To"]'
//   const destinationSelector = 'div.airport-text-code'
//   // Chhatrapati Shivaji Maharaj International

//   const onewaySelector = 'input[name="isOneWay"]'
//   const dateLabelSelector = 'input[placeholder="Departure date"]'
//   const dateSelector = 'div + div.CalendarMonthGrid_month__horizontal.CalendarMonthGrid_month__horizontal_1 + div tr td[role="button"]'
//   const submitButtonSelector = 'button[type="submit"]'
  
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







//------------------TESTS FAILING ON CI (reason no known)------------
test("Spice Jet", async () => {
  const data = flightsData.spicejet;
  const page = await browser.newPage();
  await blockImages(page)
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});
  
  // ---simulate human interaction---
  const originLabelSelector = 'input#ControlGroupSearchView_AvailabilitySearchInputSearchVieworiginStation1_CTXT'
  const originSelector = 'a[value="DEL"]'  // Delhi
  
  const destinationLabelSelector = 'input#ControlGroupSearchView_AvailabilitySearchInputSearchViewdestinationStation1_CTXT'
  const destinationSelector = '.destination div#glsControlGroupSearchView_AvailabilitySearchInputSearchViewdestinationStation1_CTNR a[value="BOM"]' // Bombay
  
  const dateLabelSelector = 'input.custom_date_pic'
  const dateSelector = 'div.ui-datepicker-group.ui-datepicker-group-last tbody tr td a' 
  
  const submitButtonSelector = 'input.bookbtn'
  
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