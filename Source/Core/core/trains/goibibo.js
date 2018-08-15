class goibiboManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "irctc"; //select one of the emission information sources from trainEmissions.json
    this.MODE = ["irctc"]; // Currently average data is available only. Hence using general IRCTC name..
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("goibibo");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("india");
  }

  setStyle(emission) {
    emission.style.fontSize = "small";
    emission.querySelector("svg").style.margin = "2px 5px";
    return emission;
  }

  insertInDom(emission, element) {
    element = this.validator.querySelector(".trainSrpDetail", element)
      .firstChild;
    emission = this.setStyle(emission);
    console.log(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (document.querySelectorAll(".srpCard").length === 0) return;
    document.querySelectorAll(".srpCard").forEach(row => {
      if (row.getElementsByClassName("carbon").length != 0) return;
      var trainName = this.validator
        .querySelector(".width100.fl.ico18.greyDr.fmed", row)
        .textContent.trim();
      var trainDuration =
        parseInt(
          this.validator
            .querySelector(".fl.ico15.fmed.greyDr", row)
            .textContent.split(" ")[0],
          10
        ) +
        parseInt(
          this.validator
            .querySelector(".fl.ico15.fmed.greyDr", row)
            .textContent.split(" ")[1],
          10
        ) /
          60;
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
        distanceBetween = trainSpeedData["average"] * trainDuration;
      this.insertInDom(this.footprintCore.getEmission([this.MODE]), row); //There is only 1 type of train
    });
  }
}

var WebsiteManager = goibiboManager;
