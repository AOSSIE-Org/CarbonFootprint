class eurostarManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
    this.MODE = ["eurostar"];
    this.validator = new TrainsValidator("eurostar");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("europe");
  }

  setStyle(emission) {
    emission.style.fontSize = "small";
    emission.style.padding = "0";
    return emission;
  }

  insertInDom(emission, element) {
    var li = element.lastChild;
    emission = this.setStyle(emission);
    console.log(emission);
    li.appendChild(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(li);
    }
  }

  update() {
    if (document.querySelectorAll("ul.train-table li").length === 0) return;
    document.querySelectorAll("ul.train-table div.train").forEach(row => {
      if (row.getElementsByClassName("carbon").length != 0) return;
      var trainDurationInArray = this.validator
        .getByClass("duration", row)[0]
        .textContent.split(" ");
      var trainDuration;
      if (trainDurationInArray.length === 2) {
        trainDuration =
          parseInt(trainDurationInArray[0], 10) +
          parseInt(trainDurationInArray[1], 10) / 60;
      } else {
        trainDuration = parseInt(trainDurationInArray[0], 10) / 60;
      }
      debugger;
      distanceBetween = trainDuration * trainSpeedData["eurostar"];
      this.insertInDom(
        this.footprintCore.getEmission([this.MODE]),
        this.validator.querySelector("ul.train-schedule", row)
      );
    });
  }
}

var WebsiteManager = eurostarManager;
