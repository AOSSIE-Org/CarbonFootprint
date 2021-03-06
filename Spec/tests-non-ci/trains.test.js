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
  const page = await browser.newPage();
  await blockImages(page)
  await page.setViewport({
    width: 1200,
    height: 700,
    deviceScaleFactor: 1,
  });
  await page.goto(data.url, {waitUntil: 'load', timeout: 0});

  // -----------SELECTORS-------------
  
  const departureLabel = 'input[name="departureStation"]'
  const departure = 'ul.ui-autocomplete li'
  
  const arrivalLabel = 'input[name="arrivalStation"]'
  const arrival = 'ul.ui-autocomplete#ui-id-2 li'
  
  const dateLabel = 'input[name="departureDate"]'
  const submitButton = 'button[title="Cerca"]'

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

test("transwa", async () => { 
// Extension not working
  const data = trainsData.transwa;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`1+${nextMonthName}+${yearForNextMonth}`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("transwa Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("lyria", async () => { 
// Extension not working
  const data = trainsData.lyria;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`01%2F${nextMonth}%2F${yearForNextMonth}`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("lyria Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("oui", async () => {
  //extension not working
  const data = trainsData.oui;
  const page = await browser.newPage();
  // await blockImages(page);
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  const surveyNoSelector = '#survey-no'
  const fromInputSelector = '#vsb-origin-train-launch'
  const toInputSelector = '#vsb-destination-train-launch'
  const dateLabelSelector = '.vsb-date-summary.vsb-date-summary--as'
  const dateSelector = `#train-launch-d-01-${nextMonth}-${yearForNextMonth}`
  const submitDateSelector = '#vsb-departure-train-launch-modal-submit'
  
  const searchButtonSelector = '#vsb-booking-train-launch-submit'
  
  // await page.click(surveyNoSelector)
  await page.click(fromInputSelector)
  await page.keyboard.type('Paris')
  await sleep(3000)
  await page.keyboard.press('Enter')
  
  await page.click(toInputSelector)
  await page.keyboard.type('Marse')
  await sleep(3000)
  await page.keyboard.press('Enter')

  await page.click(dateLabelSelector)
  await page.click(dateSelector)
  await page.click(submitDateSelector)
  await page.click(searchButtonSelector)

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("oui Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);


test("beurope", async () => {
  //extension not working and blocking bots by recaptcha
  const data = trainsData.beurope;
  const page = await browser.newPage();
  // await blockImages(page);
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  const fromInputSelector = '#departure-station'
  const toInputSelector = '#return-station'
  const onewaySelector = '#travel-type label + label'
  const dateLabelSelector = '#departure-date'
  const dateSelector = '.pika-lendar+.pika-lendar tbody tr td:not(.is-empty)'
  
  const searchButtonSelector = '#QsmSearch'
  
  await page.click(fromInputSelector)
  await page.keyboard.type('Paris')
  await sleep(3000)
  await page.keyboard.press('Enter')
  
  await page.click(toInputSelector)
  await page.keyboard.type('Amsterdam')
  await sleep(3000)
  await page.keyboard.press('Enter')

  await page.click(dateLabelSelector)
  await page.click(dateSelector)
  await page.click(searchButtonSelector)

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("beurope Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);


test("viarail", async () => {
  //extension not working 
  const data = trainsData.viarail;
  const page = await browser.newPage();
  // await blockImages(page);
  await page.goto(data.url , {waitUntil: 'domcontentloaded', timeout: 0});

  const fromInputSelector = '#cmbStationsFrom'
  const toInputSelector = '#cmbStationsTo'
  const onewaySelector = 'label.ui-checkboxradio-label + label.ui-checkboxradio-label'
  const dateLabelSelector = '#txtDateFrom'
  
  const searchButtonSelector = '#Gtm_Retail_Search_SearchBtn'
  
  await page.click(fromInputSelector)
  await page.keyboard.type('DARTMOUTH')
  await sleep(3000)
  await page.keyboard.press('Enter')
  
  await page.click(toInputSelector)
  await page.keyboard.type('HALIFAX')
  await sleep(3000)
  await page.keyboard.press('Enter')
  await page.click(onewaySelector)
  
  await page.click(dateLabelSelector)
  await page.click(dateLabelSelector)
  await page.click(dateLabelSelector)
  await page.keyboard.press('Backspace');
  // const dateValue = await page.$eval(dateLabelSelector, el => el.value);
  // for (let i = 0; i < dateValue.length; i++) {
  //     await page.keyboard.press('Delete');
  // }
  await page.keyboard.type(`${nextMonth}/01/${yearForNextMonth}`)
  await page.keyboard.press('Enter')
  
  await page.click(searchButtonSelector)

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("viarail Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("wanderu", async () => { 
  // Extension not working
    const data = trainsData.wanderu;
    const page = await browser.newPage();
    await page.goto(data.url.split('|').join(`${yearForNextMonth}-${nextMonth}-01`) , {waitUntil: 'load', timeout: 0});
  
    await page.waitFor('#carbon', {timeout: 50000});
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("wanderu Emission: ", emissionFloat) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 70000);

  


test("irctc", async () => {
  //extension not working 
  const data = trainsData.irctc;
  const page = await browser.newPage();
  // await blockImages(page);
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  const fromInputSelector = 'input[placeholder="From*"]'
  const toInputSelector = 'input[placeholder="To*"]'
  const dateLabelSelector = 'input[placeholder="Journey Date(dd-mm-yyyy)*"]'
  
  const searchButtonSelector = 'button.search_btn'
  
  await page.click(fromInputSelector)
  await page.keyboard.type('Mumbai')
  await sleep(1000)
  await page.keyboard.press('Enter')
  
  await page.click(toInputSelector)
  await page.keyboard.type('BENGALURU')
  await sleep(1000)
  await page.keyboard.press('Enter')
  
  await page.click(dateLabelSelector)
  const dateValue = await page.$eval(dateLabelSelector, el => el.value);
  for (let i = 0; i < dateValue.length; i++) {
      await page.keyboard.press('Backspace');
  }
  await page.keyboard.type(`01-${nextMonth}-${yearForNextMonth}`)
  await sleep(1000)
  await page.keyboard.press('Enter')
  
  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("irctc Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);

test("goibibo", async () => { 
  // Extension not working
    const data = trainsData.goibibo;
    const page = await browser.newPage();
    await page.goto(data.url.split('|').join(`${yearForNextMonth}${nextMonth}01`) , {waitUntil: 'load', timeout: 0});
  
    await page.waitFor('#carbon', {timeout: 50000});
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("goibibo Emission: ", emissionFloat) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 70000);

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
  await sleep(1000)
  await page.keyboard.press('Enter')
  
  await page.click(toInputSelector)
  await page.keyboard.type('Liverpool')
  await sleep(1000)
  await page.keyboard.press('Enter')
  await page.click(oneWaySelector)
  
  await page.click(dateLabelSelector)
  await page.click(oneWaySelector)

  await page.click(searchButtonSelector)

  await page.waitFor('#carbon', {timeout: 150000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("redspottedhanky Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 170000);

// --------------------NOT WORKING ON CI (reason not known)------------------
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

  await page.waitFor(fromInputSelector)
  await page.click(fromInputSelector)
  await page.keyboard.type('berl')
  await page.waitFor(fromSelector)
  await page.click(fromSelector)

  await page.click(toInputSelector)
  await page.keyboard.type('frankf')
  await sleep(3000)
  await page.waitFor(toSelector)
  await page.click(toSelector)

  await page.click(dateLabelSelector)
  await page.click(dateSelector)
  await page.click(searchButtonSelector)

  await page.waitFor('#carbon', {timeout: 70000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("bahn Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 100000);


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
  
  await page.click(toInputSelector)
  await page.keyboard.type('Liverpool')
  
  
  await page.click(dateLabelSelector)
  await page.click(dateSelector)
  await sleep(1000)


  await page.click(searchButtonSelector)
  await page.click(searchButtonSelector)

  await page.waitFor('#carbon', {timeout: 70000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("raileurope Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 170000);

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