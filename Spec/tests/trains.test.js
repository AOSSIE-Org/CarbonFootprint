const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const trainsData = require("./trains.json")
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
      width: 1400,
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
test("Eurostar", async () => {
    // Working tests passing
    const data = trainsData.eurostar;
    const page = await browser.newPage();
    await page.goto(data.url.split('|').join(`${yearForNextMonth}-${nextMonth}-01`) , {waitUntil: 'load', timeout: 0});
  
    await page.waitFor('#carbon', {timeout: 50000});
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Eurostar Emission: ", emissionFloat) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 70000);

test("Kayak Train", async () => { // working, tests passing
  const data = trainsData.kayak;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${yearForNextMonth}-${nextMonth}-01`) , {waitUntil: 'load', timeout: 0});
  const gdprCloseButton = '.Common-Gdpr-CookieConsent button'
  const gdprCloseButtonv2 = '.Common-Gdpr-CookieConsentV2 button'

  try{
    await page.click(gdprCloseButton)
  } catch(err) {}
  try{
    await page.click(gdprCloseButtonv2)
  } catch(err) {}
  
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Kayak Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("National Rail", async () => { 
  const data = trainsData.nationalrail;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`01${nextMonth}${yearForNextMonth%100}`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("National Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("bahn", async () => {
  const data = trainsData.bahn;
  const page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  const fromInputSelector = '#locS0'
  const fromSelector = '#suggestionCon div'
  
  const toInputSelector = '#locZ0'
  const toSelector = '#suggestionCon div'

  const dateLabelSelector = '#callink0'
  const dateSelector = '#callink0_row_4 td.enabled'
  const searchButtonSelector = '#searchConnectionButton'

  await page.click(fromInputSelector)
  await page.keyboard.type('berl')
  await page.waitFor(fromSelector)
  await page.click(fromSelector)

  await page.click(toInputSelector)
  await page.keyboard.type('frankf')
  await page.waitFor(toSelector)
  await page.click(toSelector)

  await page.click(dateLabelSelector)
  await page.click(dateSelector)
  await page.click(searchButtonSelector)

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("bahn Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("italotreno", async () => {
  const data = trainsData.italotreno;
  const page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  const fromInputSelector = '#departure-city_'
  const toInputSelector = '#arrival-city_'
  const dateLabelSelector = '#BookingRicercaRestylingBookingAcquistoRicercaView_TextboxMarketDate_1'
  const dateLabelNextSelector = 'a[data-handler="next"]'
  const dateSelector = 'table.ui-datepicker-calendar tbody tr td:nth-last-of-type(1)'
  
  const searchButtonSelector = '#BookingRicercaRestylingBookingAcquistoRicercaView_ButtonSubmit'
  
  await page.click(fromInputSelector)
  await page.keyboard.type('Milano Rog')
  await page.keyboard.press('Enter')
  
  await page.click(toInputSelector)
  await page.keyboard.type('Roma Tib')
  await page.keyboard.press('Enter')

  await page.click(dateLabelSelector)
  await page.click(dateLabelNextSelector)
  await page.click(dateSelector)
  await page.waitForSelector(searchButtonSelector)
  await page.click(searchButtonSelector)

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("italotreno Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);


// test("amtrak", async () => {
//   const data = trainsData.amtrak;
//   const page = await browser.newPage();
//   await page.goto(data.url , {waitUntil: 'load', timeout: 0});

//   const fromInputSelector = '#departs'
//   const toInputSelector = '#arrives'
//   const dateLabelSelector = '#wdfdate1'
//   const dateSelector = `span.k-in-month`
//   console.log(dateSelector)
  
//   const searchButtonSelector = 'farefinder_done'
  
//   await page.click(fromInputSelector)
//   await page.keyboard.type('NY')
//   await page.keyboard.press('Enter')
  
//   await page.click(toInputSelector)
//   await page.keyboard.type('WAS')
//   await page.keyboard.press('Enter')

//   await page.click(dateLabelSelector)
//   await sleep(2000)
//   await page.waitForSelector(dateSelector)
//   await page.click(dateSelector)
//   await page.waitForSelector(searchButtonSelector)
//   await page.click(searchButtonSelector)

//   await page.waitFor('#carbon', {timeout: 50000});
//   const emission = await page.$eval("#carbon", el => el.innerText)
//   const emissionFloat = parseFloat(emission)
//   console.log("amtrak Rail Emission: ", emissionFloat) 
//   expect(emissionFloat).toBeGreaterThan(0);
//   page.close();
// }, 70000);


test("redspottedhanky", async () => {
  const data = trainsData.redspottedhanky;
  const page = await browser.newPage();
  await blockImages(page);
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});

  const fromInputSelector = '#lcOrigin'
  const toInputSelector = '#lcDestination'
  const oneWaySelector = '#rdoOneWay'
  const dateLabelSelector = '#outwardDate'
  
  const searchButtonSelector = '#btnSearch'
  
  await page.click(fromInputSelector)
  await page.keyboard.type('London')
  await page.keyboard.press('Enter')
  
  await page.click(toInputSelector)
  await page.keyboard.type('Liverpool')
  await page.keyboard.press('Enter')
  await page.click(oneWaySelector)
  
  await page.click(dateLabelSelector)
  await page.click(oneWaySelector)

  await page.click(searchButtonSelector)

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("redspottedhanky Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("raileurope", async () => {
  const data = trainsData.raileurope;
  const page = await browser.newPage();
  // await blockImages(page);
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});

  const fromInputSelector = 'input.js-origincity'
  const fromSelector = 'li.ui-menu-item'
  const toInputSelector = 'input.js-destinationcity'
  const toSelector = 'li.ui-menu-item'
  const oneWaySelector = 'label[for="ptpform-oneway"]'
  const dateLabelSelector = 'input.js-departuredate'
  const dateSelector = 'table.ui-datepicker-calendar tbody tr:nth-last-of-type(1) td:nth-last-of-type(1)'
  const anytimeSelector = 'a.js-hourpickany'
  
  const searchButtonSelector = 'button.js-ptpform-submit.form-submit.btn-cta'
  
  await page.click(oneWaySelector)
  await page.click(fromInputSelector)
  await page.keyboard.type('London')
  // await page.waitForSelector(fromSelector)
  // await page.click(fromSelector)
  
  await page.click(toInputSelector)
  await page.keyboard.type('Liverpool')
  // await page.waitForSelector(toSelector)
  // await page.click(toSelector)
  
  
  await page.click(dateLabelSelector)
  await page.click(dateSelector)
  await sleep(1000)
  // await page.click(anytimeSelector)


  await page.click(searchButtonSelector)
  await page.click(searchButtonSelector)

  await page.waitFor('#carbon', {timeout: 70000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("raileurope Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 170000);


test("trainose", async () => {
  const data = trainsData.trainose;
  const page = await browser.newPage();
  // await blockImages(page);
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  const fromInputSelector = '.chosen-container'
  const toInputSelector = '.chosen-container:nth-of-type(2)'
  const dateLabelSelector = 'input[name="date"]'
  const dateSelector = '#ui-datepicker-div tbody tr:nth-last-of-type(1) td'
  
  const searchButtonSelector = '.button.button-blue'
  
  await page.click(fromInputSelector)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  
  await page.click(toInputSelector)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
    
  await page.click(dateLabelSelector)
  await page.click(dateSelector)

  await page.click(searchButtonSelector)
  await page.click(searchButtonSelector)

  await page.waitFor('#carbon', {timeout: 70000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("trainose Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 170000);
