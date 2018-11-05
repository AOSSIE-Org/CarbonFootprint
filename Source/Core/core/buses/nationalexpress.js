class nationalexpressManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "uk";
    this.validator = new BusValidator("nationalexpress");
    this.subtree = true;
    this.footprintCore.storeBusEmissionData(this.dataSource);
    this.footprintCore.storeBusSpeedData(this.dataSource);
    debugger;
  }

  setStyle(emission) {
    emission.querySelector("a").style.color = "black";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    debugger;
    if (
      document.querySelectorAll("div.ng-scope[ng-repeat='journey in data']")
        .length === 0
    )
      return;
    this.validator
      .querySelectorAll("div.ng-scope[ng-repeat='journey in data']")
      .forEach(row => {
        if (row.getElementsByClassName("carbon").length !== 0) return;
        var busDurationArray = this.validator
          .querySelector(".nx-duration.ng-binding", row)
          .textContent.trim()
          .split(" ");
        var busDuration =
          parseInt(busDurationArray[0], 10) +
          parseInt(busDurationArray[1], 10) / 60;
        debugger;
        this.insertInDom(
          this.footprintCore.getEmissionElementFromDuration(busDuration),
          this.validator.querySelector(".nx-journey-details", row)
        );
      });
  }
}

var WebsiteManager = nationalexpressManager;
