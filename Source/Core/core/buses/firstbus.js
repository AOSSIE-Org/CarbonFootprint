class firstBusManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "uk";
    this.validator = new BusValidator("firstbus");
    this.subtree = true;
    this.footprintCore.storeBusEmissionData(this.dataSource);
    this.footprintCore.storeBusSpeedData(this.dataSource);
    debugger;
  }

  setStyle(emission) {
    this.validator.querySelector("a", emission).setAttribute("style", "color:black !important;");
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (
      document.querySelectorAll(
        "li.ng-scope[data-ng-repeat='journey in results.storage.results.list track by $index']"
      ).length === 0
    )
      return;
    var self = this;
    document
      .querySelectorAll(
        "li.ng-scope[data-ng-repeat='journey in results.storage.results.list track by $index']"
      )
      .forEach(row => {
        if (row.getElementsByClassName("carbon").length !== 0) return;
        var busDurationArray = self.validator
          .querySelector(".jp-result-duration.ng-binding", row)
          .textContent.trim()
          .split(" ");
        var busDuration =
          parseInt(busDurationArray[0], 10) +
          parseInt(busDurationArray[1], 10) / 60;
        debugger;
        self.insertInDom(
          self.footprintCore.getEmissionElementFromDuration(busDuration),
          row.querySelector("a")
        )}
      );
  }
}

var WebsiteManager = firstBusManager;
