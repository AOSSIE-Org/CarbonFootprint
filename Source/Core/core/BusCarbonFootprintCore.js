var BusFootPrintCore = function(settingsProvider, helper) {
  this.settingsProvider = settingsProvider;
  this.helper = helper;
  this.getData = function(link, cb) {
    var req = new XMLHttpRequest();
    var data;
    req.open("GET", link);
    req.onreadystatechange = function(ev) {
      if (req.readyState == 4) {
        if (req.status == 200) {
          cb(JSON.parse(req.responseText));
        }
      }
    };
    req.send();
    return data;
  };
};

/**
 * Function for getting the appropriate data according to the website.
 * @param {String} dataSource source of Emission Data
 */
BusFootPrintCore.prototype.storeBusEmissionData = function(dataSource) {
  this.getData(
    this.helper.getFilePath("core/resources/busesEmissions.json"),
    function(data) {
      busEmissionData = data[dataSource];
      console.log(busEmissionData);
    }
  );
};
/**
 * Function for getting the appropriate data according to the website.
 * @param {String} dataSource source of Speed Data
 */
BusFootPrintCore.prototype.storeBusSpeedData = function(dataSource) {
  this.getData(this.helper.getFilePath("core/resources/buses.json"), function(
    data
  ) {
    busSpeedData = data[dataSource];
    console.log(busSpeedData);
  });
};
/**
 * Function for getting the appropriate data according to the website.
 * @param {String} duration in hours
 * @param {String} busType the type of bus
 * @return {HTMLDivElement} HTML element to be added into site
 */
BusFootPrintCore.prototype.getEmissionElementFromDuration = function(
  duration,
  busType
) {
  if (!busEmissionData) return;
  if (!busSpeedData) return;
  if (!busType) busType = "average";

  var useBusSpeedOf = busType,
    useEmissionOf = busType;

  if (!busSpeedData[useBusSpeedOf]) useBusSpeedOf = "average";
  if (!busEmissionData[useEmissionOf]) useEmissionOf = "average";
  var distance = duration * busSpeedData[useBusSpeedOf];
  var emission = distance * busEmissionData[useEmissionOf];
  return this.createHTMLElement(emission);
};
/**
 * Function for getting the appropriate data according to the website.
 * @param {String} distance in hours
 * @param {String} busType the type of bus
 * @return {HTMLDivElement} HTML element to be added into site
 */
BusFootPrintCore.prototype.getEmissionElementFromDistance = function(
  distance,
  busType
) {
  if (!busEmissionData) return;
  if (!busSpeedData) return;
  if (!busType) busType = "average";

  var useEmissionOf = busType;

  if (!busEmissionData[useEmissionOf]) useEmissionOf = "average";
  var emission = distance * busEmissionData[useEmissionOf];
  return this.createHTMLElement(emission);
};

/**
 * Gives a DOM element to insert in a website.
 * @param {Number} footprint  emission produced by the path.
 * @return {HTMLDivElement} as HTML element for displaying in the website.
 */
BusFootPrintCore.prototype.createHTMLElement = function(footprint) {
  var e = document.createElement("div");
  knowMoreUrl = this.helper.getFilePath("pages/knowMore.html");
  e.setAttribute("id", "carbon-footprint-label");
  e.innerHTML =
    "<a href=" +
    knowMoreUrl +
    " target='_blank' title='" +
    "footprint" +
    "' class='carbon' id='carbon'>" +
    this.footprintToString(footprint) +
    // question mark icon using svg
    '<svg id="quest_mark_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 92"><path d="M45.4 0C20 0.3-0.3 21.2 0 46.6c0.3 25.4 21.2 45.7 46.6 45.4 25.4-0.3 45.7-21.2 45.4-46.6C91.7 20 70.8-0.3 45.4 0zM45.3 74l-0.3 0c-3.9-0.1-6.7-3-6.6-6.9 0.1-3.8 2.9-6.5 6.7-6.5l0.2 0c4 0.1 6.7 3 6.6 6.9C51.9 71.3 49.1 74 45.3 74zM61.7 41.3c-0.9 1.3-2.9 2.9-5.5 4.9l-2.8 1.9c-1.5 1.2-2.5 2.3-2.8 3.4 -0.3 0.9-0.4 1.1-0.4 2.9l0 0.5H39.4l0-0.9c0.1-3.7 0.2-5.9 1.8-7.7 2.4-2.8 7.8-6.3 8-6.4 0.8-0.6 1.4-1.2 1.9-1.9 1.1-1.6 1.6-2.8 1.6-4 0-1.7-0.5-3.2-1.5-4.6 -0.9-1.3-2.7-2-5.3-2 -2.6 0-4.3 0.8-5.4 2.5 -1.1 1.7-1.6 3.5-1.6 5.4v0.5H27.9l0-0.5c0.3-6.8 2.7-11.6 7.2-14.5C37.9 18.9 41.4 18 45.5 18c5.3 0 9.9 1.3 13.4 3.9 3.6 2.6 5.4 6.5 5.4 11.6C64.4 36.3 63.5 38.9 61.7 41.3z" /></svg>';
  e.querySelector("a").addEventListener("click", function(e) {
    e.stopPropagation();
  });
  return e;
};

/**
 * Changes the unit depending on the emission
 * @param {Number} footprint as emission produced by the path.
 * @return {Number} as emission produced by the path after processing.
 */
BusFootPrintCore.prototype.footprintToString = function(footprint) {
  var unit = " g";
  if (footprint >= 1000) {
    unit = " kg";
    footprint /= 1000;
  }
  footprint = footprint.toFixed(1);
  return "" + footprint + unit + " CO<sub>2</sub> per person";
};

var CarbonFootprintCore = BusFootPrintCore;
var busEmissionData, busSpeedData;
