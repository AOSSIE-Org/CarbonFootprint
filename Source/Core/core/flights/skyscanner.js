class skyscannerManager {
  constructor(footprintCore, settingsProvider) {
    this.core = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.validator = new FlightsValidator("skyscanner");
  }

  getList() {
    var rawList = document.getElementsByClassName("day-list-item");
    if (rawList.length) {
      var seatType = this.validator.getByClass("search-summary-info")[0]
        .innerHTML;
      if (seatType.indexOf("Economy") >= 0) {
        console.log(seatType.indexOf("Economy"));
        this.core.setSeatType("economy");
        console.log("economy");
      } else {
        this.core.setSeatType("business");
        console.log("business");
      }
    }
    console.log("raw list");
    //console.log(rawList);
    var processedList = [];
    for (var x = 0, i = rawList.length; x < i; x++) {
      var depart = rawList[x].querySelectorAll('span[data-e2e="city"')[0]
        .textContent;
      var arrive = rawList[x].querySelectorAll('span[data-e2e="city"')[1]
        .textContent;
      stops = rawList[x].querySelectorAll(".global-stop-station span")
        ? [].__proto__.slice
            .call(rawList[x].querySelectorAll(".global-stop-station span"), 0)
            .map(e => e.textContent)
        : [];
      processedList.push({
        depart,
        arrive,
        stops,
        aircraft: "A380" //hardcoded for now
      });
    }
    this.validator.verifyList(processedList);
    console.log("--- initial list ---");
    //console.log(processedList);
    return processedList;
  }

  insertInDom(processedList) {
    var insertIn = [];
    debugger;
    if (processedList.length) {
      insertIn = document.querySelectorAll(
        ".day-list-item div.bpk-ticket__paper.bpk-ticket__main.bpk-ticket__main--padded.bpk-ticket__main--horizontal > div"
      );
    }
    //console.log(insertIn);
    for (var x = 0, i = insertIn.length; x < i; x++) {
      if (!insertIn[x].querySelector(".carbon")) {
        insertIn[x].appendChild(
          this.core.createMark(
            processedList[x].co2Emission,
            processedList[x].co2Emission
          )
        );
      }
    }
  }
}

var WebsiteManager = skyscannerManager;
