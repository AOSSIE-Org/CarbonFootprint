/**
 * MapsManager for Here Maps
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * HereMapsManager namespace.
 * @constructor
 * @param {object} footprintCore
 * @param {object} settingsProvider
 */

class HereMapsManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.validator = new MapsValidator("here");
  }

  /**
   * Gets driving modes for all routes.
   * @param {object} route
   * @return {string} mode
   */

  getMode(route) {
    // return pt if no additional route info class is found
    if (!route.classList[1])
      return 'pt';
    // find the mode of route e.g. car or pedestrian
    var mode = route.classList[1].match(/route_card_(.*)/);
    if (mode){
      console.log('Route mode: ' + mode[1]);
      return mode[1];
    }
  }

  /**
   * Gets driving routes.
   * @return {string} routes
   */

  getAllDrivingRoutes() {
    var routes = [];
    // Get all non-transit driving routes suggested by Here Maps. route_card
    var r = document.getElementsByClassName('route_card');
    for (var i = 0; i < r.length; i++) { // Filtering spurious routes.
      if (this.getMode(r[i]) == 'car') {
        routes.push(r[i]);
      }
    }
    console.log(routes);
    return routes;
  }

  /**
   * Gets transit routes.
   * @return {string} routes
   */

  getAllTransitRoutes() {
    var routes = [];
    // Get all transit driving routes suggested by Here Maps. route_card
    var r = document.getElementsByClassName('route_card');
    for (var i = r.length - 1; i >= 0; i--) { // Filtering spurious routes.
      if (this.getMode(r[i]) == 'pt') {
        routes.push(r[i]);
      }
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
    var distanceString = this.validator.getByClass('distance', route)[0].innerHTML;
    this.validator.isString(distanceString);
    console.log('distanceString: ' + distanceString);
    return distanceString;
  }

  /**
   * Gets time for transit route.
   * @param {object} route
   * @return {string} timeString
   */

  getTimeString(route) {
    var timeString = this.validator.getByClass('duration', route)[0].textContent;
    this.validator.isString(timeString);
    timeString = timeString.trim();
    console.log('timeString:' + timeString);
    return timeString;
  }

  /**
   * Converts Distance.
   * @param {string} distanceStr
   * @return {float} distanceFloat
   */

  convertDistance(distanceStr) {
    if (distanceStr) {
      var distanceAndUnit = distanceStr.replace('&nbsp;', ' ').split(/ /);
      var distance = distanceAndUnit[0];
      var unit = distanceAndUnit[1];
      return this.footprintCore.getDistanceFromStrings(distance, unit);
    }
  }

  /**
   * Converts total time into hours.
   * @param {string} timeStr
   * @return {float} hrs
   */

  convertTime(timeStr) {
    if (timeStr) {
      console.log("len of time str = " + timeStr.length);
      var days = (/(\w*) d/).exec(timeStr);
      var hrs = (/(\w*) h/).exec(timeStr);
      var mins = (/(\w*) m/).exec(timeStr);
      console.log("days = " + days);
      console.log("hrs = " + hrs);
      console.log("mins = " + mins);
      if (hrs) {
        hrs = parseFloat(hrs[1]);
      }
      else {
        hrs = 0;
      }
      if (mins) {
        mins = parseFloat(mins[1]);
        hrs += mins / 60;
      }
      if (days) {
        days = parseFloat(days[1]);
        hrs += days * 24;
      }
      return hrs;
    }
  }

  /**
   * Inserts element where footprints will be displayed if not present
   * @param {object} route
   * @param {element} e
   */

  insertFootprintElement(route, e) {
    if (route.getElementsByClassName('carbon').length === 0) {
      e.setAttribute(
        'style',
        'font-size:14px; padding-bottom: 0;'
      );
      this.validator
        .getByClass('route_card_right', route)[0]
        .appendChild(e);
  }
  }

  /**
   * Inserts element where travel cost will be displayed if not present
   * @param {object} route
   * @param {element} e
   */

  insertTravelCostElement(route, e) {
    //A check to ensure that the display travel cost checkbox is checked
    if (route.getElementsByClassName('travelCost').length === 0) {
      this.validator
        .getByClass('route_card_right')[0]
        .appendChild(e);
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
    var transitRoutes = thisMap.getAllTransitRoutes();
    for (i = 0; i < transitRoutes.length; i++) {
      var timeString = this.getTimeString(transitRoutes[i]);
      var timeInHrs = this.convertTime(timeString);
      this.validator.isNumber(timeInHrs);
      timeInHrs = ' ' + timeInHrs;
      console.log("timeinHrs = " + timeInHrs);
      thisMap.insertFootprintElement(
        transitRoutes[i],
        this.footprintCore.createPTFootprintElement(timeInHrs)
      );
    }
  }
}

var WebsiteManager = HereMapsManager;
