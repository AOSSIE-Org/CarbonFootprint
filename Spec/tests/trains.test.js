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
