/**
 * BusValidator namespace.
 * @constructor
 * @param {string} website
 */

class BusValidator extends BasicValidator {
  constructor(website) {
    super(website, "bus");
    this.server = new Server();
    this.website = website;
  }

  /**
   * check if its a valid bus
   * @param {string} bus
   */

  verifyBus(bus) {
    if (typeof bus !== "string" || bus.length === 0) {
      this.counterMeasure("invalid bus type");
      return false;
    } else {
      console.log("valid bus " + bus);
      return true;
    }
  }

  /**
   * check if the string is a valid stop
   * @param {string} stop
   */

  verifyStation(stop) {
    if (typeof stop !== "string" || stop.length === 0) {
      this.counterMeasure("invalid stop " + stop);
      return false;
    }
    return true;
  }

  /**
   * use all above functions to verify the data
   * scraped from website.
   * @param {array} list
   */

  verifyList(list) {
    for (var x = 0, i = list.length; x < i; x++) {
      for (var y = 0, j = list[x].mode.length; y < j; y++) {
        this.verifyBus(list[x].mode[y]);
      }
      this.verifyStation(list[x].arrive);
      this.verifyStation(list[x].depart);
    }
  }
}
