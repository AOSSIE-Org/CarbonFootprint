/**
 * MapsManager for Yandex Maps
 */

/**
 * YandexMapsManager namespace.
 * @constructor
 * @param {object} footprintCore
 * @param {object} settingsProvider
 */

class YandexMapsManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.validator = new MapsValidator("yandex");
  }

  /**
   * Checks if the route is by driving.
   * @return {boolean}
   */

  isDriving() {
    return !!document.getElementsByClassName('route-list-view _travel-mode_auto')[0];
  }

  /**
   * Checks if the route is by transit.
   * @return {boolean}
   */

  isTransit() {
    return !!document.getElementsByClassName('route-list-view _travel-mode_masstransit')[0];
  }

  /**
   * Gets driving routes.
   * @return {string} routes
   */

  getAllDrivingRoutes() {
    var drivingRoutes = [];
    if (this.isDriving()) {
      var r = document.getElementsByClassName('route-view');
      for (var i = r.length - 1; i >= 0; i--) { // Filtering spurious routes.
        if (r[i].childNodes.length > 0) {
          drivingRoutes.push(r[i]);
        }
      }
    }
    return drivingRoutes;
  }

  /**
   * Gets transit routes.
   * @return {string} routes
   */

  getAllTransitRoutes() {
    var transitRoutes = [];
    if (this.isTransit()) {
      var r = document.getElementsByClassName('route-view');
      for (var i = r.length - 1; i >= 0; i--) { // Filtering spurious routes.
        if (r[i].childNodes.length > 0) {
          transitRoutes.push(r[i]);
        }
      }
    }
    return transitRoutes;
  }

  /**
   * Gets distance for a route.
   * @param {object} route
   * @return {string} distanceString
   */

  getDistanceString(route) {
    var distanceString = this.validator
          .getByClass('driving-route-view__route-title-secondary', route)[0]
          .innerText;
    console.log('distanceString: ' + distanceString);
    return distanceString;
  }

  /**
   * Gets time for transit route.
   * @param {object} route
   * @return {string} timeString
   */

  getTimeString(route) {
    var timeString = this.validator
          .getByClass('masstransit-route-view__route-title-primary', route)[0]
          .innerHTML;
    timeString = ' ' + timeString;
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
      var distanceAndUnit = distanceStr.split(/\s/);
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
      timeStr = timeStr.replace(/&nbsp;/gi,' ');
      var days = (/ (\w*) d/).exec(timeStr);
      var hrs = (/ (\w*) h/).exec(timeStr);
      var mins = (/ (\w*) m/).exec(timeStr);
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
      console.log(hrs);
      return hrs;
    }
  }

  /**
   * Inserts element where footprints will be displayed if not present
   * @param {object} route
   * @param {element} e
   */

  insertFootprintElement(route, e) {
    if (this.isDriving()) {
      className = 'driving-route-view';
    }else if(this.isTransit()){
      className = 'masstransit-route-view';
    }
    if (route.getElementsByClassName('carbon').length === 0) {
      this.validator.getByClass(className, route)[0].appendChild(e);
    }
  }

  /**
   * Inserts element where travel cost will be displayed if not present
   * @param {object} route
   * @param {element} e
   */

  insertTravelCostElement(route, e) {
    if (route.getElementsByClassName('travelCost').length === 0) {
      this.validator.getByClass('driving-route-view', route)[0].appendChild(e);
    }
  }

  /**
   * called by MutationObeserver to update footprints
   */

  update() {
    var drivingRoutes = this.getAllDrivingRoutes();
    var transitRoutes = this.getAllTransitRoutes();
    for (var i = 0; i < drivingRoutes.length; i++) {
      var distanceString = this.getDistanceString(drivingRoutes[i]);
      this.validator.isString(distanceString);
      var distanceInKm = this.convertDistance(distanceString);
      this.validator.isNumber(distanceInKm);
      this.insertFootprintElement(
        drivingRoutes[i],
        this.footprintCore.createFootprintElement(distanceInKm)
      );
      if (this.settingsProvider.showTravelCost()) {
        this.insertTravelCostElement(
          drivingRoutes[i],
          this.footprintCore.createTravelCostElement(distanceInKm)
        );
      }
    }
    for (i = 0; i < transitRoutes.length; i++) {
      var timeString = this.getTimeString(transitRoutes[i]);
      this.validator.isString(timeString);
      var timeInHrs = this.convertTime(timeString);
      this.validator.isNumber(timeInHrs);
      this.insertFootprintElement(
        transitRoutes[i],
        this.footprintCore.createPTFootprintElement(timeInHrs)
      );
    }
  }
}

var WebsiteManager = YandexMapsManager;
