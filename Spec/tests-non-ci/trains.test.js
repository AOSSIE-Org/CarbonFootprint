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


test("Trenitalia", async () => { 
  // message port was closed before a message was recieved
  const data = trainsData.trenitalia;
  let page = await browser.newPage();
  await blockImages(page)
  await page.setViewport({
    width: 1200,
    height: 700,
    deviceScaleFactor: 1,
  });
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});

  // -----------SELECTORS-------------
  
  var departureLabel = 'input[name="departureStation"]'
  var departure = 'ul.ui-autocomplete li'
  
  var arrivalLabel = 'input[name="arrivalStation"]'
  var arrival = 'ul.ui-autocomplete#ui-id-2 li'
  
  var dateLabel = 'input[name="departureDate"]'
  var submitButton = 'button[title="Cerca"]'

  // ---- HUMAN INTERACTION --------
  await page.waitForSelector(departureLabel, {timeout: 70000})
  await page.click(departureLabel)
  await page.keyboard.type('Vene');
  await page.waitForSelector(departure)
  await page.click(departure)
  
  await page.click(arrivalLabel)
  await page.keyboard.type('Roma');
  await page.waitForSelector(arrival)
  await page.click(arrival)

  await page.click(dateLabel)
  const dateValue = await page.$eval(dateLabel, el => el.value);
  for (let i = 0; i < dateValue.length; i++) {
      await page.keyboard.press('Backspace');
  }
  await page.keyboard.type(`01-${nextMonth}-${yearForNextMonth}`);
  await page.click(submitButton)

  // ---------- PERFORM TESTS-------------
  await page.waitFor('#carbon', {timeout: 100000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Trenitalia Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 120000);

test("virgintrains", async () => {
  //extension not working
  const data = trainsData.virgintrains;
  const page = await browser.newPage();
  // await blockImages(page);
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  const fromInputSelector = '#FromStation_77ba2960-f400-4f88-b019-161c61bba1cd'
  const toInputSelector = '#ToStation_77ba2960-f400-4f88-b019-161c61bba1cd'
  const dateLabelSelector = 'button[title="Select date"]'
  const dateSelector = 'table.ui-datepicker-calendar tbody tr:nth-last-of-type(1) td[class=" "]'
  const oneWaySelector = 'label[for="optionOneWay_77ba2960-f400-4f88-b019-161c61bba1cd"]'
  
  const searchButtonSelector = 'button.btn.btn-submit'
  
  await page.click(fromInputSelector)
  await page.keyboard.type('London')
  await page.keyboard.press('Enter')
  
  await page.click(toInputSelector)
  await page.keyboard.type('Castleton (Manchester')
  await page.keyboard.press('Enter')

  await page.click(dateLabelSelector)
  await page.click(dateSelector)
  await page.click(oneWaySelector)
  await page.waitForSelector(searchButtonSelector)
  await page.click(searchButtonSelector)

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("virgintrains Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);


test("sj", async () => { 
// temporary server error
  const data = trainsData.sj;
  const page = await browser.newPage();
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("sj Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("southernrailway", async () => { 
// Extension not working
  const data = trainsData.southernrailway;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${yearForNextMonth}-${nextMonth}-01`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("southernrailway Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("transportnsw", async () => { 
// Extension not working
  const data = trainsData.transportnsw;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${yearForNextMonth}-${nextMonth}-01`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("transportnsw Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("thetrainline", async () => { 
// Extension not working
  const data = trainsData.thetrainline;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${yearForNextMonth}-${nextMonth}-01`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("thetrainline Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);
