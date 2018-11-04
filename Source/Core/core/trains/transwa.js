var transwaManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.MODE = ["transwa"];
  this.dataSource = "australia"; //select one of the emission information sources from trainEmissions.json
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("transwa");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("australia");
};

transwaManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "small";
  return emission;
};

transwaManager.prototype.insertInDom = function(emission, element) {
  element = this.validator.querySelector("span", element);
  emission = this.setStyle(emission);
  console.log(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

transwaManager.prototype.update = function() {
  if (document.querySelectorAll(".jbsRouteTextColumn").length === 0) return;
  this.validator.querySelectorAll(".jbsRouteTextColumn").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length != 0) return;
    var trainName = this.validator
      .querySelector("li span")
      .textContent.trim()
      .split(" ")[0];

    var trainDuration =
      parseInt(
        this.validator
          .querySelector("span", row)
          .textContent.trim()
          .split(" ")[3]
      ) +
      parseInt(
        this.validator
          .querySelector("span", row)
          .textContent.trim()
          .split(" ")[5]
      ) /
        60;
    debugger;
    var usingAverageSpeed = true;
    for (trainTestString in trainSpeedData) {
      trainName.split(" ").forEach(function(word) {
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
};

var WebsiteManager = transwaManager;
