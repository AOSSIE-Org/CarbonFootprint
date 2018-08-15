/**
 * ViaMichelinMapsManager namespace.
 * @constructor
 * @param {object} footprintCore
 * @param {object} settingsProvider
 */

class ViaMichelinMapsManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.validator = new MapsValidator("viaMichelin");
  }

  /**
   * Converts distance string to distance in Km.
   * NOTE: ViaMichelin maps always gives distance in km
   * @return {string}
   */

  getDistanceString(d) {
    return d.split(" ")[0];
  }

  /**
   * Gets All routes.
   * NOTE: ViaMichelin maps only has driving routes, no public transit routes
   * @return {array} routes
   */

  getAllRoutes() {
    var element = document.getElementsByClassName("itinerary-index-summary");
    if (element[0] && element[0].childNodes[0]) {
      debugger;
      table = this.validator.getChildNode([0, 2], element[0]);
    } else {
      table = false;
    }
    var routes = [];
    //console.log(table);
    if (table) {
      var rows = table.querySelectorAll("li");
      for (var i = 0, row; (row = rows[i]); i++) {
        var route = this.validator.querySelector("span:nth-child(3)", row);
        routes.push({
          distance: route.innerHTML.trim()
        });
      }
    }
    return routes;
  }

  /**
   * Inserts element where footprints will be displayed if not present
   * @param {array} routes
   */

  insertFootprintElement(routes) {
    var el = this.validator.getByClass("summary-header");
    console.log(el);
    if (el) {
      for (var i = 0, t = el.length; i < t; i++) {
        var d = this.getDistanceString(routes[i].distance);
        this.validator.isNumber(parseFloat(d));
        if (el[i].getElementsByClassName("carbon").length === 0) {
          var element = this.footprintCore.createFootprintElement(d);
          element.setAttribute(
            "style",
            "display:inline; color:black; margin-left:1em;"
          );
          el[i].appendChild(element);
        }
      }
    }
  }

  /**
   * Inserts element where travel cost will be displayed if not present
   * @param {array} routes
   */

  insertTravelCostElement(routes) {
    var el = this.validator.getByClass("summary-header");
    console.log(el);
    if (el) {
      for (var i = 0, t = el.length; i < t; i++) {
        var d = this.getDistanceString(routes[i].distance);
        if (el[i].getElementsByClassName("travelCost").length === 0) {
          el[i].appendChild(this.footprintCore.createTravelCostElement(d));
        }
      }
    }
  }

  /*
   * called by MutationObeserver to update footprints
   */

  update() {
    var routes = this.getAllRoutes();
    if (routes.length) {
      this.insertFootprintElement(routes);
      if (this.settingsProvider.showTravelCost()) {
        this.insertTravelCostElement(routes);
      }
    }
  }
}

var WebsiteManager = ViaMichelinMapsManager;
