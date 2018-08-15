class mytrainticketManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "europe";
    this.MODE = ["mytrainticket"];
    this.validator = new TrainsValidator("mytrainticket");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("europe");
  }

  setStyle(emission) {
    emission.style.display = "inline";
    emission.style["margin-left"] = "1rem";
    emission.style["padding-top"] = "0";
    return emission;
  }

  insertInDom(emission) {
    emission = this.setStyle(emission);
    element = this.validator.querySelector("span[data-test=tab-train-container]");
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (
      document.querySelectorAll("span[data-test=tab-train-disabled]").length === 0
    )
      return;

    var trainDurationArray = this.validator
      .querySelector("span[data-test=tab-train-disabled]")
      .textContent.trim()
      .split(" ");
    var trainDuration =
      parseInt(trainDurationArray[0], 10) +
      parseInt(trainDurationArray[1], 10) / 60;
    debugger;
    distanceBetween = trainSpeedData["uk"] * trainDuration;
    this.insertInDom(this.footprintCore.getEmission([this.MODE]));
  }
}

var WebsiteManager = mytrainticketManager;
