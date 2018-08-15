class kayakManager {
  constructor(footprintCore, settingsProvider) {
    this.core = footprintCore;
    this.settingsProvider = settingsProvider;
    this.validator = new FlightsValidator("kayak");
  }

  /**
   * Function for making an object of flight
   * @return array of object
   */

  getList() {
    console.log("Hey kayak!");
    var rawList = document.getElementsByClassName("resultWrapper");
    console.log("----raw List----");
    console.log(rawList);
    var processedList = [];
    var stops;
    var depart;
    var arrive;
    var airport;
    for (var x = 0; x < rawList.length; x++) {
      stops = [].__proto__.slice
        .call(rawList[x].querySelectorAll(".layoverText", rawList[x]))
        .map(e => e.textContent.substr(e.textContent.indexOf("(") + 1, 3));
      depart = this.validator.querySelector(
        ".section.duration .bottom span",
        rawList[x]
      ).textContent;
      arrive = this.validator.querySelector(
        ".section.duration .bottom span:nth-child(3)",
        rawList[x]
      ).textContent;
      processedList.push({
        depart,
        arrive,
        stops,
        aircraft: "A380"
      });
      //console.log(stops);
    }
    this.validator.verifyList(processedList);
    console.log(processedList);
    return processedList;
  }

  /**
   * Function for inserting Element in DOM
   * @param array
   * @return array
   */

  insertInDom(processedList) {
    if (processedList) {
      var checkOption = this.validator.getByClass("resultWrapper");
      var insertIn = [];
      console.log(checkOption);
      console.log(processedList);
      for (var x = 0; x < checkOption.length; x++) {
        insertIn = this.validator.getByClass("col-info", checkOption[x]);
        insertIn = insertIn[insertIn.length - 1];
        if (checkOption[x].getElementsByClassName("carbon").length < 1) {
          insertIn.appendChild(
            this.core.createMark(
              processedList[2 * x].co2Emission,
              processedList[2 * x + 1].co2Emission
            )
          );
          console.log("inserted");
        } else {
          console.log("already presented");
        }
      }
    }
  }
}

var WebsiteManager = kayakManager;
