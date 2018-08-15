class BusFootPrintCore {
  constructor(settingsProvider, helper) {
    this.settingsProvider = settingsProvider;
    this.helper = helper;
    this.getData = (link, cb) => {
      var req = new XMLHttpRequest();
      var data;
      req.open("GET", link);
      req.onreadystatechange = ev => {
        if (req.readyState == 4) {
          if (req.status == 200) {
            cb(JSON.parse(req.responseText));
          }
        }
      };
      req.send();
      return data;
    };
  }

  /**
   * Function for getting the appropriate data according to the website.
   * @param {String} dataSource source of Emission Data
   */
  storeBusEmissionData(dataSource) {
    this.getData(
      this.helper.getFilePath("core/resources/busesEmissions.json"),
      data => {
        busEmissionData = data[dataSource];
        console.log(busEmissionData);
      }
    );
  }

  /**
   * Function for getting the appropriate data according to the website.
   * @param {String} dataSource source of Speed Data
   */
  storeBusSpeedData(dataSource) {
    this.getData(this.helper.getFilePath("core/resources/buses.json"), data => {
      busSpeedData = data[dataSource];
      console.log(busSpeedData);
    });
  }

  /**
   * Function for getting the appropriate data according to the website.
   * @param {String} duration in hours
   * @param {String} busType the type of bus
   * @return {HTMLDivElement} HTML element to be added into site
   */
  getEmissionElementFromDuration(duration, busType) {
    if (!busEmissionData) return;
    if (!busSpeedData) return;
    if (!busType) busType = "average";

    var useBusSpeedOf = busType;
    var useEmissionOf = busType;

    if (!busSpeedData[useBusSpeedOf]) useBusSpeedOf = "average";
    if (!busEmissionData[useEmissionOf]) useEmissionOf = "average";
    var distance = duration * busSpeedData[useBusSpeedOf];
    var emission = distance * busEmissionData[useEmissionOf];
    return this.createHTMLElement(emission);
  }

  /**
   * Function for getting the appropriate data according to the website.
   * @param {String} distance in hours
   * @param {String} busType the type of bus
   * @return {HTMLDivElement} HTML element to be added into site
   */
  getEmissionElementFromDistance(distance, busType) {
    if (!busEmissionData) return;
    if (!busSpeedData) return;
    if (!busType) busType = "average";

    var useEmissionOf = busType;

    if (!busEmissionData[useEmissionOf]) useEmissionOf = "average";
    var emission = distance * busEmissionData[useEmissionOf];
    return this.createHTMLElement(emission);
  }

  /**
   * Gives a DOM element to insert in a website.
   * @param {Number} footprint  emission produced by the path.
   * @return {HTMLDivElement} as HTML element for displaying in the website.
   */
  createHTMLElement(footprint) {
    var e = document.createElement("div");
    var knowMoreUrl = this.helper.getFilePath("pages/knowMore.html");
    e.setAttribute("id", "carbon-footprint-label");
    debugger;
    e.innerHTML =
      "<a href=" +
      knowMoreUrl +
      " target='_blank' title='" +
      "footprint" +
      "' class='carbon' id='carbon'>" +
      this.footprintToString(footprint) +
      // question mark icon using svg
      CarbonFootprintCommon.prototype.getSVG();
    e.querySelector("a").addEventListener("click", e => {
      e.stopPropagation();
    });
    return e;
  }

  /**
   * Changes the unit depending on the emission
   * @param {Number} footprint as emission produced by the path.
   * @return {Number} as emission produced by the path after processing.
   */
  footprintToString(footprint) {
    var unit = " g";
    if (footprint >= 1000) {
      unit = " kg";
      footprint /= 1000;
    }
    footprint = footprint.toFixed(1);
    return "" + footprint + unit + " CO<sub>2</sub> per person";
  }
}

var CarbonFootprintCore = BusFootPrintCore;
var busEmissionData;
var busSpeedData;
