const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const busesData = require("./buses.json")
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

// --------------TESTS---------------------
test("Megabus", async () => {
    const data = busesData.megabus;
    const page = await browser.newPage();
    await page.goto(data.url.split('|').join(`${currYear}-${currMonth}-${today}`) , {waitUntil: 'load', timeout: 0});

    await page.waitFor('#carbon', {timeout: 50000});
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Megabus Emission: ", emission) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 70000);

test("flixbus", async () => {
    const data = busesData.flixbus;
    const page = await browser.newPage();
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
    const page = await browser.newPage();
    await page.setViewport({
        width: 1000,
        height: 800,
        deviceScaleFactor: 1,
    });
    await page.goto(data.url , {waitUntil: 'load', timeout: 0});
    
    // ---simulate human interaction---
    const originLabelSelector = '#fromLocation'
    const originSelector = 'li[aria-label="New York, NY : Bus stop located in New York"]'
  
    const destinationLabelSelector = '#toLocation'
    const destinationSelector = '#ui-id-2 li.ui-menu-item'
    
    const dateLabelSelector = '#datepicker-from'
    const submitButtonSelector = '#fare-search-btn'
    
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

test("peterpanbus", async () => { 
    const data = busesData.peterpanbus;
    const page = await browser.newPage();
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
    console.log("peterpanbus Buses Emission: ", emission) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
  }, 100000);

  test("Murrays Buses", async () => { 
  // Test not working, can't copy human data. due to visible stuff

    const data = busesData.murrays;
    const page = await browser.newPage();
    await page.goto(data.url , {waitUntil: 'load', timeout: 0});
    
    // ---simulate human interaction---
    const originLabelSelector = '#ddOrigin'
    const originSelector = 'option[value="JOLI"]'
  
    const destinationLabelSelector = '#ddDestination'
    const destinationSelector = 'option[value="EDDY"]'

    const oneWaySelector = 'input[value="OneWay"]'
    
    const dateLabelSelector = 'input[name="DepartureDate"]'
    const passSelector = '.lnks a + a'
    const submitButtonSelector = '#btnContinue'
    
    await page.waitForSelector(originLabelSelector)
    await page.click(originLabelSelector)
    await sleep(1000)
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    
    await page.click(destinationLabelSelector)
    await sleep(1000)
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await page.click(oneWaySelector)
    
    await page.click(dateLabelSelector)
    await page.keyboard.type(`01/${nextMonth}/${yearForNextMonth}`);
    await page.keyboard.press('Enter');

    await page.click(passSelector)
    await page.click(submitButtonSelector)
    
    // ----perform test----
    await page.waitFor('#carbon',  { timeout: 70000, visible: true });
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("Murrays Buses Emission: ", emission) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 100000);

  test("washny", async () => { 
  // Test not working, can't copy human data. due to visible stuff

    const data = busesData.washny;
    const page = await browser.newPage();
    await page.goto(data.url , {waitUntil: 'load', timeout: 0});
    
    // ---simulate human interaction---
    const oneWaySelector = 'input[onclick="document.getElementById(\'hide_show_return\').style.display = \'none\'"]'

    const originLabelSelector = 'select[name="area_id"]'
  
    const dateLabelSelector = '#datepicker'
    const dateSelector = '.ui-datepicker-group.ui-datepicker-group-last tbody td[class=" "]'
    const submitButtonSelector = '.home_reserv_box_button input[type="image"]'
    
    await page.waitForSelector(oneWaySelector)
    await page.click(oneWaySelector)
    
    await page.click(originLabelSelector)
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.click(dateLabelSelector)
    await sleep(2000)
    await page.click(dateSelector)
    await sleep(1000)
    
    await page.waitForSelector(submitButtonSelector)
    await page.click(submitButtonSelector)
    // ----perform test----
    await page.waitFor('#carbon',  { timeout: 70000, visible: true });
    const emission = await page.$eval("#carbon", el => el.innerText)
    const emissionFloat = parseFloat(emission)
    console.log("washny Buses Emission: ", emission) 
    expect(emissionFloat).toBeGreaterThan(0);
    page.close();
}, 100000);


test("firstgroup", async () => { 
  const data = busesData.firstgroup;
  const page = await browser.newPage();
  await page.setViewport({
      width: 1000,
      height: 800,
      deviceScaleFactor: 1,
  });
  await page.goto(data.url.split('|').join(`${yearForNextMonth}-${nextMonth}-01`) , {waitUntil: 'load', timeout: 0});
  
  // ----perform test----
  await page.waitFor('#carbon', {timeout: 70000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("firstgroup Buses Emission: ", emission) 
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 100000);