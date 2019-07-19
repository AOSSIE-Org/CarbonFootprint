const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const trainsData = require("./trains.json")
const {blockImages} = require("../helpers/requestInterception")
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
test("Eurostar", async () => {
    // Working tests passing
    const data = trainsData.eurostar;
    let page = await browser.newPage();
    await page.goto(data.url.split('|').join(`${year}-${nextMonth}-01`) , {waitUntil: 'load', timeout: 0});
  
    await page.waitFor('#carbon', {timeout: 50000});
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Eurostar Emission: ", emissionFloat) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 70000);

test("Trenitalia", async () => { //working, tests passing
    const data = trainsData.trenitalia;
    let page = await browser.newPage();
    await blockImages(page)
    await page.setViewport({
      width: 1080,
      height: 800,
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
    await page.keyboard.type(`01-${nextMonth}-${year}`);
    await page.click(submitButton)

    // ---------- PERFORM TESTS-------------
    await page.waitFor('#carbon', {timeout: 70000});
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Trenitalia Emission: ", emissionFloat) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 100000);

test("Kayak Train", async () => { // working, tests passing
  const data = trainsData.kayak;
  let page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${year}-${nextMonth}-01`) , {waitUntil: 'load', timeout: 0});
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

test("National Rail", async () => { //working tests passing
  const data = trainsData.nationalrail;
  let page = await browser.newPage();
  await page.goto(data.url.split('|').join(`01${nextMonth}${year%100}`) , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon', {timeout: 50000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("National Rail Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 70000);