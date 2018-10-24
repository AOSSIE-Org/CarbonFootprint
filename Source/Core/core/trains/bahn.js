class bahnManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("bahn");
    this.footprintCore.storeTrainSpeed("europe");
    this.footprintCore.storeDataSource(this.dataSource);
  }

  setStyle(emission) {
    emission.style.fontSize = "small";
    return emission;
  }

  insertInDom(emission, element) {
    if (element.querySelector(".carbon.verified")) return;
    emission = this.setStyle(emission);
    element = this.validator.querySelector("tr.buttonLine .time",element);
    console.log(emission);
    if (element.querySelector(".carbon") && emission.classList.length !== 2)
      return;

    if (!element.querySelector(".carbon")) {
      element.appendChild(emission);
      return;
    }

    if (
      element.querySelectorAll(".carbon.verified").length === 0 &&
      emission.classList.length === 2
    ) {
      element.removeChild(this.validator.querySelector("carbon",element));
      element.appendChild(emission);
      return;
    }
  }

  update() {
    if (document.querySelectorAll(".boxShadow.scheduledCon").length === 0)
      return;
    row = document.querySelectorAll(".boxShadow.scheduledCon");
    document.querySelectorAll(".boxShadow.scheduledCon").forEach(row => {
      if (
        row.querySelector(".detailContainer") &&
        !row.querySelector(".carbon.verified")
      ) {
        if (row.getElementsByClassName("carbon").length != 0) return;

        var totalFootPrint = 0;

        var fromArray = row.querySelectorAll("tr.first");
        var toArray = row.querySelectorAll("tr.last");

        for (var index in fromArray) {
          var trainName = "intercity-express";
          totalFootPrint = 0;

          var fromTime = 
            this.validator.querySelector(".nowrap.time",fromArray[index])
            .textContent.trim()
            .split(" ")[
              this.validator.querySelector(".nowrap.time",fromArray[index])
                .textContent.trim()
                .split(" ").length - 1
            ].split(":");

          var toTime =             
          his.validator.querySelector(".nowrap.time",fromArray[index])
            .textContent.trim()
            .split(" ")[
              this.validator.querySelector(".nowrap.time",fromArray[index])
              .textContent.trim().split(" ").length - 1].split(":");

          var startDate = new Date(0, 0, 0, fromTime[0], fromTime[1], 0);
          var endDate = new Date(0, 0, 0, toTime[0], toTime[1], 0);

          var diff = endDate.getTime() - startDate.getTime();
          var trainDuration = diff / (1000 * 60 * 60);
          if (trainDuration < 0) trainDuration = trainDuration + 24;
          distanceBetween = trainSpeedData[trainName] * trainDuration;
          totalFootPrint += trainData["average"] * distanceBetween;
        }

        this.insertInDom(
          this.footprintCore
            .createHTMLElement(totalFootPrint)
            .classList.add("verified"),
          row
        );
      } else {
        if (!row.querySelector("carbon")) {
          trainName = "intercity-express";
          totalFootPrint = 0;
          var trainDurationArray = this.validator
            .querySelector(".duration.lastrow")
            .textContent.trim()
            .split(":");
          trainDuration =
            Number(trainDurationArray[0]) + Number(trainDurationArray[1]) / 60;
          distanceBetween = trainSpeedData[trainName] * trainDuration;
          totalFootPrint += trainData["average"] * distanceBetween;
        }
        this.insertInDom(
          this.footprintCore.createHTMLElement(totalFootPrint),
          row
        );
      }
    });
  }
}

var WebsiteManager = bahnManager;
