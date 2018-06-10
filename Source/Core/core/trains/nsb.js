var nsbManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
  this.MODE = ["nsb"];
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("nsb");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("europe");
};

nsbManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "medium";
  return emission;
};

nsbManager.prototype.insertInDom = function(emission, element) {
  if (!element) return;
  emission = this.setStyle(emission);
  console.log(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

nsbManager.prototype.update = function() {
  var self = this;
  document.querySelectorAll(".itinerary-list-item").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length != 0) return;

    var trainDuration;
    if (
      self.validator
        .querySelector(".itinerary-duration .duration", row)
        .textContent.split(" ").length === 2
    ) {
      trainDuration =
        parseInt(
          self.validator
            .querySelector(".itinerary-duration .duration", row)
            .textContent.split(" ")[0]
        ) +
        parseInt(
          self.validator
            .querySelector(".itinerary-duration .duration", row)
            .textContent.split(" ")[1]
        ) /
          60;
    } else {
      trainDuration =
        parseInt(
          self.validator
            .querySelector(".itinerary-duration .duration", row)
            .textContent.split(" ")[0]
        ) / 60;
    }
    debugger;
    distanceBetween = trainDuration * trainSpeedData["nsb"];
    var element = self.validator.querySelector("button", row);
    self.insertInDom(self.footprintCore.getEmission([self.MODE]), element); //There is only 1 type of train
  });
};

var WebsiteManager = nsbManager;
