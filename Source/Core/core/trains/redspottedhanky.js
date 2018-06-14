var redspottedhankyManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
  this.MODE = ["uk"]; // Currently average data is available only. Hence using general IRCTC name..
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("redspottedhanky");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("europe");
};

redspottedhankyManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "inherit";
  return emission;
};

redspottedhankyManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  var td = document.createElement("td");
  td.classList.add("FaresViewEmptyCell");
  td.appendChild(emission);
  console.log(td);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(td);
  }
};

redspottedhankyManager.prototype.update = function() {
  if (
    !(
      document.querySelector("table.FaresView").querySelector("tr:only-child")
        .lastChild.textContent === "CO2 emission"
    )
  ) {
    var x = document
      .querySelector("table.FaresView")
      .querySelector("th")
      .cloneNode();
    x.textContent = "CO2 emission";
    document
      .querySelector("table.FaresView")
      .querySelector("tr:only-child")
      .appendChild(x);
  }
  debugger;
  var self = this;
  document.querySelectorAll(".FaresViewDetail").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length != 0) return;

    var trainName = "redspottedhanky";
    var trainDurationArray = self.validator
      .querySelector(".FaresViewDuration", row)
      .textContent.trim()
      .split(" ");
    var trainDuration =
      parseInt(trainDurationArray[0], 10) +
      parseInt(trainDurationArray[1], 10) / 60;
    if (!trainSpeedData[trainName])
      trainName = trainSpeedData["uk"] ? "uk" : "average";
    distanceBetween = trainSpeedData[trainName] * trainDuration;
    self.insertInDom(self.footprintCore.getEmission([self.MODE]), row); //There is only 1 type of train
  });
};

var WebsiteManager = redspottedhankyManager;
