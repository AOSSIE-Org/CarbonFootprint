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

// --------------TESTS---------------------
test("Megabus", async () => {
    const data = busesData.megabus;
    let page = await browser.newPage();
    await page.goto(data.url.split('|').join(`${currYear}-${currMonth}-${today}`) , {waitUntil: 'load', timeout: 0});

    await page.waitFor('#carbon');
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Megabus Emission: ", emission) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 50000);

test("flixbus", async () => {
    //Extension not working
    const data = busesData.flixbus;
    let page = await browser.newPage();
    await page.goto(data.url.split('|').join(`${today}.${currMonth}.${currYear}`) , {waitUntil: 'load', timeout: 0});

    await page.waitFor('#carbon');
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Flixbus Emission: ", emission) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 50000);

test("Greyhound Buses", async () => { 
    const data = busesData.greyhound;
    let page = await browser.newPage();
    await page.setViewport({
        width: 1000,
        height: 800,
        deviceScaleFactor: 1,
    });
    await page.goto(data.url , {waitUntil: 'load', timeout: 0});
    
    // ---simulate human interaction---
    var originLabelSelector = '#fromLocation'
    var originSelector = 'li[aria-label="New York, NY : Bus stop located in New York"]'
  
    var destinationLabelSelector = '#toLocation'
    var destinationSelector = '#ui-id-2 li.ui-menu-item'
    
    var dateLabelSelector = '#datepicker-from'
    var submitButtonSelector = '#fare-search-btn'
    
    await page.waitForSelector(originLabelSelector)
    await page.click(originLabelSelector)
    await page.keyboard.type('New York');
    await page.keyboard.press('Enter');
    await page.waitForSelector(originSelector)
    await page.click(originSelector)
    
    await page.click(destinationLabelSelector)
    await page.keyboard.type('Albany');
    await page.waitForSelector(destinationSelector)
    await page.click(destinationSelector)
    
    await page.click(dateLabelSelector)
    await page.keyboard.press('Enter');
    await page.click(submitButtonSelector)
    
    // ----perform test----
    await page.waitFor('#carbon',  { timeout: 70000, visible: true });
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Greyhound Buses Emission: ", emission) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 100000);

test("Gpeterpanbus", async () => { 
    const data = busesData.peterpanbus;
    let page = await browser.newPage();
    await page.setViewport({
        width: 1000,
        height: 800,
        deviceScaleFactor: 1,
    });
    await page.goto(data.url.split('|').join(`${currMonth}%2F${today}%2F${currYear}`) , {waitUntil: 'load', timeout: 0});
    
    // ----perform test----
    await page.waitFor('#carbon', {timeout: 70000});
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Peterpanbus Buses Emission: ", emission) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
  }, 100000);