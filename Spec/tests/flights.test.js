const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const flightsData = require("./flights.json")
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

var currDate = new Date()
var nextMonth = currDate.getMonth() + 2;
var year = currDate.getFullYear();
if(nextMonth === 13) {
    nextMonth = 1;
    year += 1;
}

if(nextMonth <= 10) {
    // pad Month with 0. (8 -> 08)
    nextMonth = '0' + nextMonth
}

// test("Cleartrip Fligts", async () => {
//   const data = flightsData.cleartrip;
//   let page = await browser.newPage();
//   await page.goto(data.url + `01/${nextMonth}/${year}`, {waitUntil: 'load', timeout: 0});

//   await page.waitFor('#carbon');
//   const emission = await page.$eval("#carbon", el => el.innerText)
//   const emissionFloat = parseFloat(emission)
//   console.log("Bing Maps Emission: ", emissionFloat) 
//   expect(emissionFloat).toBeGreaterThan(0);
//   page.close();
// }, 50000);


test("Google Flights", async () => {
    //extension not working on some websites
  const data = flightsData.googleflights;
  let page = await browser.newPage();
  await page.goto(data.url + `${year}-${nextMonth}-01;c:INR;e:1;sd:1;t:f;tt:o` , {waitUntil: 'load', timeout: 0});

  await page.waitFor('#carbon');
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Bing Maps Emission: ", emissionFloat) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 50000);


// test("Makemytrip Fligts", async () => {
//     //extension not working
//   const data = flightsData.makemytrip;
//   let page = await browser.newPage();
//   await page.goto(data.url + `01/${nextMonth}/${year}`, {waitUntil: 'load', timeout: 0});

//   await page.waitFor('#carbon');
//   const emission = await page.$eval("#carbon", el => el.innerText)
//   const emissionFloat = parseFloat(emission)
//   console.log("Bing Maps Emission: ", emissionFloat) 
//   expect(emissionFloat).toBeGreaterThan(0);
//   page.close();
// }, 50000);


// test("Hipmunk Flights", async () => {
//   //Extension is Not working
//   const data = mapsData.hipmunk;
//   let page = await browser.newPage();
//   await page.goto(data.url + `${year}-${nextMonth}-01`, {waitUntil: 'load', timeout: 0});

//   await page.waitFor('#carbon');
//   const emission = await page.$eval("#carbon", el => el.innerText)
//   const emissionFloat = parseFloat(emission)
//   console.log("Bing Maps Emission: ", emissionFloat) 
//   expect(emissionFloat).toBeGreaterThan(0);
//   page.close();
// }, 50000);




// test("Sky Scanner", async () => {
    //Website does not allow bots
//   const data = mapsData.skyscanner;
//   let page = await browser.newPage();
//   await page.goto(data.url, {waitUntil: 'load', timeout: 0});

//   //type source
//   await page.waitForSelector('input#fsc-origin-search')
//   await page.click('input#fsc-origin-search')
//   await page.keyboard.type('New Delhi');
//   await page.keyboard.press('Enter');
//   //type destination
//   await page.waitForSelector('input#fsc-destination-search')
//   await page.click('input#fsc-destination-search')
//   await page.keyboard.type('New York');
//   await page.keyboard.press('Enter');
//   //submit
//   await page.click('button[type="submit"]')
  
//   await page.waitFor('#carbon');
//   const emission = await page.$eval("#carbon", el => el.innerText)
//   const emissionFloat = parseFloat(emission)
//   console.log("Bing Maps Emission: ", emissionFloat) 
//   expect(emissionFloat).toBeGreaterThan(0);
//   page.close();
// }, 50000);
  