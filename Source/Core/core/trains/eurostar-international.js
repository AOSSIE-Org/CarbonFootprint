var eurostarManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
  this.MODE = ["eurostar"];
  this.validator = new TrainsValidator("eurostar");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("europe");
};

eurostarManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "small";
  emission.style.padding = "0";
  return emission;
};

eurostarManager.prototype.insertInDom = function(emission, element) {
  var li = element.lastChild;
  emission = this.setStyle(emission);
  console.log(emission);
  li.appendChild(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(li);
  }
};

eurostarManager.prototype.update = function() {
  if (document.querySelectorAll("ul.train-table li").length === 0) return;
  var self = this;
  document.querySelectorAll("ul.train-table div.train").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length != 0) return;
    var trainDurationInArray = self.validator
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
    self.insertInDom(
      self.footprintCore.getEmission([self.MODE]),
      self.validator.querySelector("ul.train-schedule", row)
    );
  });
};

var WebsiteManager = eurostarManager;
