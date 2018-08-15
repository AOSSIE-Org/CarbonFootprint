class aaManager {
  constructor(footprintCore, settingsProvider) {
    this.core = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.list = [];
    this.childList = false;
    this.validator = new FlightsValidator("americanAirlines");
  }

  getList() {
    var rawList = document.getElementsByClassName("bound-table-flightline");
    console.log("raw list");
    console.log(rawList);
    var processedList = [];
    for (var x = 0, i = rawList.length; x < i; x++) {
      var stops = [];
      processedList.push({
        depart: this.validator
          .getByClass("citycode-from", rawList[x])[0]
          .textContent.trim()
          .substring(1, 4),
        arrive: this.validator
          .getByClass("citycode-to", rawList[x])[0]
          .textContent.trim()
          .substring(1, 4),
        stops,
        aircraft: "A380", //hardcoded for now,
        updated: false,
        aircraftStore: []
      });
      if (
        rawList[x].getElementsByClassName("segment timeline-segment").length
      ) {
        processedList[processedList.length - 1].updated = true;
        for (
          var y = 0,
            j = this.validator.getByClass("timeline-airline", rawList[x])
              .length;
          y < j;
          y++
        ) {
          processedList[processedList.length - 1].aircraftStore.push(
            this.validator.getByClass("equipment", j[y])[0].innerText.trim()
          );
        }
        for (
          y = 1,
            j =
              this.validator.getByClass("timeline-locationcode", rawList[x])
                .length - 1;
          y < j;
          y += 2
        ) {
          processedList[processedList.length - 1].stops.push(
            this.validator
              .getByClass("timeline-locationcode", rawList[x])[y].innerText.trim()
          );
        }
      }
    }
    if (this.list.length === 0) {
      this.list = processedList;
    }
    debugger;
    for (x = 0, i = processedList.length; x < i; x++) {
      if (processedList[x].updated) {
        this.list[x] = processedList[x];
      }
    }
    console.log("--- initial list ---");
    console.log(processedList);
    this.validator.verifyList(processedList);
    return this.list;
  }

  insertInDom(processedList) {
    if (processedList.length > 0) {
      insertIn = this.validator.getByClass("bound-table-flightline-header");
      for (var x = 0, i = insertIn.length; x < i; x++) {
        if (insertIn[x].getElementsByClassName("carbon").length === 0) {
          insertIn[x].appendChild(
            this.core.createMark(processedList[x].co2Emission)
          );
        } else {
          insertIn[x].removeChild(
            insertIn[x].childNodes[insertIn[x].childNodes.length - 1]
          );
          insertIn[x].appendChild(
            this.core.createMark(processedList[x].co2Emission)
          );
        }
      }
    }
  }
}

var WebsiteManager = aaManager;
