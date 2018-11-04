class trainoseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("trainose");
    this.footprintCore.storeTrainSpeed("europe");
    this.footprintCore.storeDataSource(this.dataSource);
    this.subtree = true;
  }

  setStyle(emission) {
    emission.style.fontSize = "small";
    emission.style.color = "black";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    console.log(emission);
    if (!element.querySelector(".carbon")) {
      element.appendChild(emission);
      return;
    }
  }

  update() {
    debugger;
    if (document.querySelectorAll(".dromologio").length === 0) return;
    this.validator.querySelectorAll(".dromologio").forEach(row => {
      if (row.querySelector(".trip-segment")) {
        if (row.getElementsByClassName("carbon").length != 0) return;

        var totalFootPrint = 0;

        var fromArray = this.validator.querySelectorAll(".tanax", row);
        var toArray = this.validator.querySelectorAll(".tafix", row);
        var trainName = "trainose";
        if (!trainSpeedData[trainName])
          trainName = trainSpeedData["greece"] ? "greece" : "average";
        fromArray.forEach((val, index) => {
          var fromTime = fromArray[index].textContent.trim().split(":");

          var toTime = toArray[index].textContent.trim().split(":");
          var startDate = new Date(0, 0, 0, fromTime[0], fromTime[1], 0);
          var endDate = new Date(0, 0, 0, toTime[0], toTime[1], 0);

          var diff = endDate.getTime() - startDate.getTime();
          var trainDuration = diff / (1000 * 60 * 60);
          if (trainDuration < 0) trainDuration = trainDuration + 24;
          distanceBetween = trainSpeedData[trainName] * trainDuration;
          totalFootPrint += trainData["greece"] * distanceBetween;
        });

        this.insertInDom(
          this.footprintCore.createHTMLElement(totalFootPrint),
          this.validator.querySelector(".dim.dashtop.sml9", row)
        );
      }
    });
  }
}

var WebsiteManager = trainoseManager;
