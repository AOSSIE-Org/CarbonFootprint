const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const busesData = require("./buses.json")
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
      width: 1000,
      height: 800,
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
var currMonth = currDate.getMonth() + 1;
var today = currDate.getDate();
if(today < 10) today = '0' + today;
var currYear = currDate.getFullYear();
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

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

test("nationalexpress", async () => { 
  const data = busesData.nationalexpress;
  let page = await browser.newPage();
  await page.setViewport({
      width: 1800,
      height: 800,
      deviceScaleFactor: 1,
  });
  await page.goto(data.url , {waitUntil: 'load', timeout: 0});

  var originLabelSelector = '#fromStation'
  var originSelector = 'ul.plannerForm--nearby-stops li'

  var destinationLabelSelector = '#toStation'
  var destinationSelector = 'ul.js--plannerForm--station-to-search-results li'

  var dateLabelSelector = '#departDate'
  var dateSelector = 'table.ui-datepicker-calendar tbody tr +tr+tr+tr+tr td.undefined'
  var submitButtonSelector = '#jpSubmit'

  await page.waitForSelector(originLabelSelector)
  await page.click(originLabelSelector)
  await page.keyboard.type("london victoria")
  await page.waitForSelector(originSelector)
  await page.click(originSelector)
  
  await page.click(destinationLabelSelector)
  await page.keyboard.type("london golders")
  await page.waitForSelector(destinationSelector)
  await page.click(destinationSelector)
  
  await page.click(dateLabelSelector)
  await page.waitForSelector(dateSelector)
  await page.click(dateSelector)

  await page.click(submitButtonSelector)
  
  // ----perform test----
  await page.waitFor('#carbon', {timeout: 70000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("nationalexpress Buses Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 100000);