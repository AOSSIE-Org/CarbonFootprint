var railEuropeManager = function(footprintCore, settingsProvider) {
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
};

railEuropeManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "small";
  // emission.classList.add("spec");
  return emission;
};

railEuropeManager.prototype.insertInDom = function(emission, element) {
  if (element.getElementsByClassName("carbon").length !== 0) return;
  emission = this.setStyle(emission);
  element = element.querySelector(".train-specs");
  console.log(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

railEuropeManager.prototype.update = function() {
  if (document.querySelectorAll(".row.js-solution").length === 0) return;
  var self = this;
  document.querySelectorAll(".row.js-solution").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length != 0) return;

    var totalFootPrint = 0;

    row.querySelectorAll(".segment-line").forEach(function(train) {
      var trainDurationArray = train
        .querySelector(".spec.spec-duration")
        .textContent.trim()
        .split(" ");

      var trainDuration =
        parseInt(trainDurationArray[1], 10) / 60 +
        parseInt(trainDurationArray[0], 10);

      var trainName = train
        .querySelector(".spec.spec-carrier")
        .textContent.trim();
      var usingAverageSpeed = true;
      for (trainTestString in trainSpeedData) {
        trainName.split(" ").forEach(function(word) {
          if (
            self.footprintCore.fuzzySearch(word.toLowerCase(), trainTestString)
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

    self.insertInDom(self.footprintCore.createHTMLElement(totalFootPrint), row);
  });
};

var WebsiteManager = railEuropeManager;
