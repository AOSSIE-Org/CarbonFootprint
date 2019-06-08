/**
 * CruiseValidator namespace.
 * @constructor
 * @param {string} website
 */

class CruiseValidator extends BasicValidator {
  constructor(website) {
    super(website, "cruises");
    this.server = new Server();
    this.website = website;
  }

  // /**
  //  * check if its a valid cruise
  //  * @param {string} cruise
  //  */
  // verifyCruise(cruise) {
  //   if (typeof cruise !== "string" || bus.length === 0) {
  //     this.counterMeasure("invalid cruise type");
  //     return false;
  //   } else {
  //     console.log("valid cruise " + cruise);
  //     return true;
  //   }
  // }

  // /**
  //  * check if the string is a valid stop
  //  * @param {string} stop
  //  */
  // verifyPort(stop) {
  //   if (typeof stop !== "string" || stop.length === 0) {
  //     this.counterMeasure("invalid stop " + stop);
  //     return false;
  //   }
  //   return true;
  // }

  // /**
  //  * use all above functions to verify the data
  //  * scraped from website.
  //  * @param {array} list
  //  */

  // verifyList(list) {
  //   // for (var x = 0, i = list.length; x < i; x++) {
  //   //   for (var y = 0, j = list[x].mode.length; y < j; y++) {
  //   //     this.verifyBus(list[x].mode[y]);
  //   //   }
  //   //   this.verifyStation(list[x].arrive);
  //   //   this.verifyStation(list[x].depart);
  //   // }
  // }
}
