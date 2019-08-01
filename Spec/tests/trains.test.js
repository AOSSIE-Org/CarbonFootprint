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
      width: 1300,
      height: 1900,
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
    let page = await browser.newPage();
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
  let page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${yearForNextMonth}-${nextMonth}-01`) , {waitUntil: 'load', timeout: 0});
  var gdprCloseButton = '.Common-Gdpr-CookieConsent button'
  var gdprCloseButtonv2 = '.Common-Gdpr-CookieConsentV2 button'

  try{
    await page.click(gdprCloseButton)
  } catch {}
  try{
    await page.click(gdprCloseButtonv2)
  } catch {}
  
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

