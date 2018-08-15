/**
 * MapsManager for Map Quest
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

/**
 * MapQuestMapsManager namespace.
 * @constructor
 * @param {object} footprintCore
 * @param {object} settingsProvider
 */

class MapQuestMapsManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = false;
    // click handler for angular route change
    var thisMap = this;
    this.validator = new MapsValidator("mapquest");
    var ul = document.getElementsByTagName('body')[0];
    ul.addEventListener('click', e => {
      if (e.target.parentNode.classList[1] ===
          'routes' && e.target.tagName === 'LI') {
        // Check if the element is a LI
        thisMap.update();
      }
    });
  }

  /**
   * Checks if the route is by driving.
   * @return {boolean}
   */

  isDriving() {
    var m = document.getElementsByClassName('transport-modes')[0];
    if (m) {
      var mode = m.classList[1].substring(0, 3);
      console.log('Route mode: ' + mode);
      return mode == 'car';
    }
    return false;
  }

  /**
   * Gets distance for a route.
   * @return {string} distanceString
   */

  getDistanceString() {
      var routingSummary = document.querySelector('.route-selection .distance');
      if (routingSummary) {
          var distanceString = routingSummary.innerText;
          console.log('distanceString: ' + distanceString);
          return distanceString;
      }
      console.error('no routingSummary found distanceString is 0');
      return 0;
  }

  /**
   * Converts Distance.
   * @param {string} distanceStr
   * @return {float} distanceFloat
   */

  convertDistance(distanceStr) {
    if (distanceStr) {
      var distance = distanceStr.match(/[0-9,.]+/)[0];
      var unit = distanceStr.match(/[a-z,A-Z]+/)[0];
      var distanceFloat = this
            .footprintCore.getDistanceFromStrings(distance, unit);
      return distanceFloat;
    }
  }

  /**
   * Inserts element where footprints will be displayed if not present
   * @param {element} e
   */

  insertFootprintElement(e) {
    e.id = 'footprintDiv';
    if (document.getElementById('footprintDiv')) {
      var el = this.validator.getById('footprintDiv');
      el.parentNode.removeChild(el);
    }
    var directionButton = this.validator
          .querySelector('.route-selection .view-directions');
    e.setAttribute(
      'style',
      'padding:3px 15px;display:inline-block;position:relative;'
    );
    this.validator.querySelector('.via-area').insertBefore(e, directionButton);
  }

  /**
   * Inserts element where travel cost will be displayed if not present
   * @param {element} e
   */

  insertTravelCostElement(e) {
    e.id = 'travelCostDiv';
    if (document.getElementById('travelCostDiv')) {
      var el = this.validator.getById('travelCostDiv');
      el.parentNode.removeChild(el);
    }
    var directionButton = this.validator
          .querySelector('.route-selection .view-directions');
    e.setAttribute(
      'style',
      'padding:3px 15px;display:inline-block;position:relative;'
    );
    this.validator.querySelector('.via-area').insertBefore(e, directionButton);
  }

  /**
   * called by MutationObeserver to update footprints
   */

  update() {
    console.log('update!');
    if (this.isDriving()) {
      var distanceString = this.getDistanceString();
      this.validator.isString(distanceString);
      if (distanceString) {
        var distanceInKm = this.convertDistance(distanceString);
        this.validator.isNumber(distanceInKm);
        this.insertFootprintElement(
          this.footprintCore.createFootprintElement(distanceInKm)
        );
        if (this.settingsProvider.showTravelCost()) {
          this.insertTravelCostElement(
            this.footprintCore.createTravelCostElement(distanceInKm)
          );
        }
      }
    }
  }
}

var WebsiteManager = MapQuestMapsManager;
