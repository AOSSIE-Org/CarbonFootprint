var irctcManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.dataSource = "irctc"; //select one of the emission information sources from trainEmissions.json
  this.MODE = ["irctc"]; // Currently average data is available only. Hence using general IRCTC name..
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("irctc");
  this.footprintCore.storeDataSource(this.dataSource);
};

irctcManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "x-large";
  return emission;
};

irctcManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  console.log(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

irctcManager.prototype.update = function() {
  if (
    !(
      document
        .querySelector("table.rf-dt.width100.journeyTrainList")
        .querySelector("tr:only-child").lastChild.textContent === "CO2 emission"
    )
  ) {
    var x = document
      .querySelector("table.rf-dt.width100.journeyTrainList")
      .querySelector("tr:only-child")
      .lastChild.cloneNode();
    x.textContent = "CO2 emission";
    document
      .querySelector("table.rf-dt.width100.journeyTrainList")
      .querySelector("tr:only-child")
      .appendChild(x);
  }
  debugger;
  var self = this;
  this.validator
    .getByClass("rf-dt width100 journeyTrainList")[0]
    .querySelectorAll("tbody.rf-dt-b tr")
    .forEach(function(row) {
      distanceBetween = self.validator.getChildNode([6], row).textContent;
      if (row.getElementsByClassName("carbon").length != 0) return;
      var x = row.lastChild.cloneNode();
      self.insertInDom(self.footprintCore.getEmission([self.MODE]), x); //There is only 1 type of train
      row.appendChild(x);
    });
};

var WebsiteManager = irctcManager;
