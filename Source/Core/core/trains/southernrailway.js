class southernRailManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "europe";
    this.MODE = ["uk"];
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("southernrailway");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("europe");
  }

  setStyle(emission) {
    emission.style.fontSize = "small";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    element = this.validator.querySelector(".service-item__duration", element);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (document.querySelectorAll(".display__row").length === 0) return;
    this.validator.querySelectorAll(".display__row").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;
      var trainName = "southernrailway";
      var trainDuration;
      var trainDurationArray = this.validator
        .querySelector(".duration", row)
        .textContent.trim()
        .split(" ");
      if (trainDurationArray.length === 1) {
        trainDuration = parseInt(trainDurationArray[0], 10) / 60;
      } else trainDuration = parseInt(trainDurationArray[0], 10) + parseInt(trainDurationArray[1], 10) / 60;
      debugger;
      if (!trainSpeedData[trainName])
        trainName = trainSpeedData["uk"] ? "uk" : "average";
      distanceBetween = trainSpeedData[trainName] * trainDuration;
      this.insertInDom(this.footprintCore.getEmission([this.MODE]), row); //There is only 1 type of train
    });
  }
}

var WebsiteManager = southernRailManager;
