class nationalRailManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "europe";
    this.MODE = ["uk"];
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("nationalrail");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("europe");
  }

  setStyle(emission) {
    emission.style.fontSize = "small";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    element = this.validator.querySelector(".from", element);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (document.querySelectorAll(".mtx").length === 0) return;
    document.querySelectorAll(".mtx").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;
      var trainName = "nationalrail";
      var trainDuration =
        Number(
          this.validator
            .querySelector(".dur abbr[title=hours]", row)
            .previousSibling.textContent.trim()
        ) +
        Number(
          this.validator
            .querySelector(".dur abbr[title=minutes]", row)
            .previousSibling.textContent.trim()
        ) /
          60;
      debugger;
      if (!trainSpeedData[trainName])
        trainName = trainSpeedData["uk"] ? "uk" : "average";
      distanceBetween = trainSpeedData[trainName] * trainDuration;
      this.insertInDom(this.footprintCore.getEmission([this.MODE]), row); //There is only 1 type of train
    });
  }
}

var WebsiteManager = nationalRailManager;
