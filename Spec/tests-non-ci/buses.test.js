const puppeteer = require("puppeteer");
const CRX_PATH = "Build/Chrome";
const busesData = require("./buses.json");
const { blockImages } = require("../helpers/requestInterception");
const {
  DATE,
  currMonth,
  today,
  currYear,
  nextMonth,
  yearForNextMonth,
  nextMonthName,
  currMonthName,
  sleep
} = require("../helpers/dateHelper");
let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false, // extensions only supported in full chrome.
    args: [
      "--no-sandbox",
      `--disable-extensions-except=${CRX_PATH}`,
      `--load-extension=${CRX_PATH}`
    ],
    defaultViewport: {
      width: 1000,
      height: 800,
      deviceScaleFactor: 1
    }
  });

  pages = await browser.pages();
  pages[0].close();
});

afterAll(() => {
  browser.close();
});

test("nationalexpress", async () => {
  const data = busesData.nationalexpress;
  const page = await browser.newPage();
  await page.setViewport({
    width: 1800,
    height: 800,
    deviceScaleFactor: 1
  });
  await page.goto(data.url, { waitUntil: "load", timeout: 0 });

  const originLabelSelector = "#fromStation";
  const originSelector = "ul.plannerForm--nearby-stops li";

  const destinationLabelSelector = "#toStation";
  const destinationSelector = "ul.js--plannerForm--station-to-search-results li";

  const dateLabelSelector = "#departDate";
  const dateSelector =
    "table.ui-datepicker-calendar tbody tr +tr+tr+tr+tr td.undefined";
  const submitButtonSelector = "#jpSubmit";

  await page.waitForSelector(originLabelSelector);
  await page.click(originLabelSelector);
  await page.keyboard.type("london victoria");
  await page.waitForSelector(originSelector);
  await page.click(originSelector);

  await page.click(destinationLabelSelector);
  await page.keyboard.type("london golders");
  await page.waitForSelector(destinationSelector);
  await page.click(destinationSelector);

  await page.click(dateLabelSelector);
  await page.waitForSelector(dateSelector);
  await page.click(dateSelector);

  await page.click(submitButtonSelector);

  // ----perform test----
  await page.waitFor("#carbon", { timeout: 70000 });
  const emission = await page.$eval("#carbon", el => el.innerText);
  const emissionFloat = parseFloat(emission);
  console.log("nationalexpress Buses Emission: ", emission);
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 100000);

test("boltbus", async () => {
  const data = busesData.boltbus;
  const page = await browser.newPage();
  await page.setViewport({
    width: 1800,
    height: 800,
    deviceScaleFactor: 1
  });
  await blockImages(page);
  const query = `t=1&d=10&a=2055&tfa=1&ada=0&dd=${nextMonth}%2F01%2F${yearForNextMonth}&rd=`
  const b64 = Buffer.from(query).toString('base64')
  await page.goto(data.url.split('|').join(b64), { waitUntil: "load", timeout: 0 });

  // ----perform test----
  await page.waitFor("#carbon", { timeout: 70000 });
  const emission = await page.$eval("#carbon", el => el.innerText);
  const emissionFloat = parseFloat(emission);
  console.log("boltbus Buses Emission: ", emission);
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 100000);

test("ourbus", async () => {
  const data = busesData.ourbus;
  const page = await browser.newPage();
  await page.setViewport({
    width: 1800,
    height: 800,
    deviceScaleFactor: 1
  });
  await blockImages(page);
  await page.goto(data.url, { waitUntil: "load", timeout: 0 });

  const originLabelSelector = "#source";
  const originSelector = "#myDropdown";

  const destinationLabelSelector = "#destination";
  const destinationSelector = "#_myDropdown";

  const dateLabelSelector = "#longdatepickerDepart"; //07/31/2019
  const dateSelector =
    'table.table-condensed tbody td[class="day"]:nth-last-of-type(1)';
  const submitButtonSelector = ".redign_book_tckt_btn";

  await page.waitForSelector(originLabelSelector);
  await page.click(originLabelSelector);
  await page.keyboard.type("Boston");
  await page.waitForSelector(originSelector);
  await page.click(originSelector);

  await page.waitForSelector(destinationLabelSelector);
  await page.click(destinationLabelSelector);
  await page.keyboard.type("New York");
  await page.waitForSelector(destinationSelector);
  await page.click(destinationSelector);

  await page.click(dateLabelSelector);
  await page.click(dateSelector);

  await page.click(submitButtonSelector);

  // ----perform test----
  await page.waitFor("#carbon", { timeout: 70000 });
  const emission = await page.$eval("#carbon", el => el.innerText);
  const emissionFloat = parseFloat(emission);
  console.log("ourbus Buses Emission: ", emission);
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 100000);

test("traveline", async () => {
  const data = busesData.traveline;
  const page = await browser.newPage();
  await page.setViewport({
    width: 1800,
    height: 800,
    deviceScaleFactor: 1
  });
  await blockImages(page);
  await page.goto(data.url, { waitUntil: "load", timeout: 0 });

  const originLabelSelector = "#origin";
  const originSelector = 'li[aria-label="Boston Bus Station. This is a locality. This is result 1 of 100."]'
  const destSelector = 'li[aria-label="New York (N Yorks), North Yorkshire. This is a National Public Transport Gazetteer locality. This is result 1 of 100."]'
  const submitButtonSelector = "#submitText";

  await page.waitForSelector(originLabelSelector);
  await page.click(originLabelSelector);
  await page.keyboard.type("Boston");
  await page.keyboard.press("Tab");
  await page.keyboard.type("New York");
  await page.click(submitButtonSelector);
  
  await page.waitForSelector(originSelector);
  await page.click(originSelector);
  // visible
  await page.waitForFunction(selector => document.querySelector('#destinationList').classList[1] === "visible");
  await page.waitForSelector(destSelector);
  await page.click(destSelector);
  await page.keyboard.press("Enter");

  // ----perform test----
  await page.waitFor("#carbon", { timeout: 70000 });
  const emission = await page.$eval("#carbon", el => el.innerText);
  const emissionFloat = parseFloat(emission);
  console.log("traveline Buses Emission: ", emission);
  expect(emissionFloat).toBeGreaterThan(0);
  page.close();
}, 100000);



// -----------------TESTS FAILING ON CI (reason unknown)------------------------
test("Megabus", async () => {
  const data = busesData.megabus;
  const page = await browser.newPage();
  await page.goto(data.url.split('|').join(`${currYear}-${currMonth}-${today}`) , {waitUntil: 'domcontentloaded', timeout: 0});

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

  await page.waitFor('#carbon', {timeout: 70000});
  const emission = await page.$eval("#carbon", el => el.innerText)
  const emissionFloat = parseFloat(emission)
  console.log("Flixbus Emission: ", emission) 
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