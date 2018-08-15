class kayaktrainManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.MODE = ["uk"];
    this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("kayak");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("europe");
  }

  setStyle(emission) {
    emission.classList.add("detailsBlock");
    emission.style.fontSize = "small";
    emission.style.padding = "0";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    console.log(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (document.querySelectorAll(".col-info.result-column").length === 0) return;
    document.querySelectorAll(".col-info.result-column").forEach(row => {
      if (row.getElementsByClassName("carbon").length != 0) return;
      var trainName = this.validator
        .querySelector(".detailsBlock.provider-name", row)
        .textContent.trim();
      var trainDurationArray = this.validator
        .querySelector(".col-field.duration .top", row)
        .textContent.trim()
        .split(" ");
      var trainDuration =
        parseInt(trainDurationArray[0], 10) +
        parseInt(trainDurationArray[1], 10) / 60;
      debugger;
      var usingAverageSpeed = true;
      for (trainTestString in trainSpeedData) {
        trainName.split(" ").forEach(word => {
          if (
            this.footprintCore.fuzzySearch(word.toLowerCase(), trainTestString)
          ) {
            usingAverageSpeed = false;
            distanceBetween = trainDuration * trainSpeedData[trainTestString];
            return;
          }
        });
        if (!usingAverageSpeed) break;
      }
      if (usingAverageSpeed)
        distanceBetween = trainSpeedData["uk"] * trainDuration;
      this.insertInDom(
        this.footprintCore.getEmission([this.MODE]),
        this.validator.querySelector(".detailsRow", row)
      ); //There is only 1 type of train
    });
  }
}

var WebsiteManager = kayaktrainManager;
