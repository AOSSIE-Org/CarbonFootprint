/**
 * MapsManager for Waze
 */

/**
 * WazeMapsManager namespace.
 * @constructor
 * @param {object} footprintCore
 * @param {object} settingsProvider
 */

class WazeMapsManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.validator = new MapsValidator("waze");
    this.update();
  }

  /**
   * Gets driving routes.
   * @return {string} routes
   */

  getAllDrivingRoutes() {
    var routes = [];
    // Get all routes suggested by waze Maps. route-info
    var r = document.getElementsByClassName("wm-route-item__stats");
    for (var i = r.length - 1; i >= 0; i--) {
      debugger;
      routes.push(r[i]);
    }
    console.log(routes);
    return routes;
  }

  /**
   * Gets distance for a route.
   * @param {object} route
   * @return {string} distanceString
   */

  getDistanceString(route) {
    var distanceString = this.validator.getByClass(
      "wm-route-item__length",
      route
    )[0].textContent;
    distanceString = distanceString.trim();
    console.log("distanceString: " + distanceString);
    return distanceString;
  }

  /**
   * Converts Distance.
   * @param {string} distanceStr
   * @return {float} distanceFloat
   */

  convertDistance(distanceStr) {
    if (distanceStr) {
      var distanceAndUnit = distanceStr.replace("&nbsp;", " ").split(/ /);
      var distance = distanceAndUnit[0];
      var unit = distanceAndUnit[1];
      return this.footprintCore.getDistanceFromStrings(distance, unit);
    }
  }

  /**
   * Inserts element where footprints will be displayed if not present
   * @param {object} route
   * @param {element} e
   */

  insertFootprintElement(route, e) {
    if (route.getElementsByClassName("carbon").length === 0) {
      e.setAttribute(
        "style",
        "padding-left:5px;display:inline-block;position:relative;"
      );
      route.appendChild(e);
    }
  }

  /**
   * Inserts element where travel cost will be displayed if not present
   * @param {object} route
   * @param {element} e
   */

  insertTravelCostElement(route, e) {
    //A check to ensure that the display travel cost checkbox is checked
    if (route.getElementsByClassName("travelCost").length === 0) {
      e.setAttribute(
        "style",
        "padding-right:15px;display:inline-block;position:relative;top:-15px;"
      );
      route.appendChild(e);
    }
  }

  /**
   * called by MutationObeserver to update footprints
   */

  update() {
    var thisMap = this;
    var drivingRoutes = thisMap.getAllDrivingRoutes();
    var i;
    for (i = 0; i < drivingRoutes.length; i++) {
      var distanceString = thisMap.getDistanceString(drivingRoutes[i]);
      this.validator.isString(distanceString);
      var distanceInKm = thisMap.convertDistance(distanceString);
      this.validator.isNumber(distanceInKm);
      thisMap.insertFootprintElement(
        drivingRoutes[i],
        thisMap.footprintCore.createFootprintElement(distanceInKm)
      );
      if (thisMap.settingsProvider.showTravelCost())
        thisMap.insertTravelCostElement(
          drivingRoutes[i],
          thisMap.footprintCore.createTravelCostElement(distanceInKm)
        );
    }
  }
}

var WebsiteManager = WazeMapsManager;
