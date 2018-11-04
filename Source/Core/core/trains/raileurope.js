class railEuropeManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("raileurope");
    this.footprintCore.storeTrainSpeed("europe");
    this.footprintCore.storeDataSource(this.dataSource);
  }

  setStyle(emission) {
    emission.style.fontSize = "small";
    // emission.classList.add("spec");
    return emission;
  }

  insertInDom(emission, element) {
    if (element.getElementsByClassName("carbon").length !== 0) return;
    emission = this.setStyle(emission);
    element = this.validator.querySelector(".train-specs", element);
    console.log(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (document.querySelectorAll(".row.js-solution").length === 0) return;
    this.validator.querySelectorAll(".row.js-solution").forEach(row => {
      if (row.getElementsByClassName("carbon").length != 0) return;

      var totalFootPrint = 0;

      this.validator.querySelectorAll(".segment-line", row).forEach(train => {
        var trainDurationArray = this.validator
          .querySelector(".spec.spec-duration", train)
          .textContent.trim()
          .split(" ");

        var trainDuration =
          parseInt(trainDurationArray[1], 10) / 60 +
          parseInt(trainDurationArray[0], 10);

        var trainName = this.validator
          .querySelector(".spec.spec-carrier", train)
          .textContent.trim();
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
        totalFootPrint += trainData["average"] * distanceBetween;
      });

      this.insertInDom(this.footprintCore.createHTMLElement(totalFootPrint), row);
    });
  }
}

var WebsiteManager = railEuropeManager;
