class yatraManager {
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
    this.validator = new TrainsValidator("yatra");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("india");
  }

  setStyle(emission) {
    emission.style.fontSize = "x-large";
    return emission;
  }

  insertInDom(emission, element) {
    var li = this.validator.querySelector("li", element);
    emission = this.setStyle(emission);
    console.log(emission);
    li.appendChild(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(li);
    }
  }

  update() {
    if (document.querySelectorAll(".train-info-block.true").length === 0) return;
    document.querySelectorAll(".train-info-block.true").forEach(row => {
      if (row.getElementsByClassName("carbon").length != 0) return;
      var trainName = this.validator
        .getByClass("trainName", row)[0]
        .textContent.split("(")[0]
        .trim();
      var trainDuration =
        Number(
          this.validator
            .getByClass("trainDuration", row)[0]
            .textContent.split(":")[0]
        ) +
        Number(
          this.validator
            .getByClass("trainDuration", row)[0]
            .textContent.split(":")[1]
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

var WebsiteManager = yatraManager;
