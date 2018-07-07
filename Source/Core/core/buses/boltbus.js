var boltBusManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "america";
  this.validator = new BusValidator("boltbus");
  this.subtree = true;
  this.footprintCore.storeBusEmissionData(this.dataSource);
  this.footprintCore.storeBusSpeedData(this.dataSource);
};

boltBusManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "2rem";
  emission.style.color = "black";
  return emission;
};

boltBusManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

boltBusManager.prototype.update = function() {
  if (document.querySelectorAll("table.fareview").length === 0) return;
  var self = this;
  document.querySelectorAll("table.fareview tr").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length !== 0) return;
    if (row.getElementsByClassName("faresColumn1").length === 0) return;

    debugger;
    var departureTimeArray = row
      .querySelector(".faresColumn1")
      .textContent.trim()
      .split(":");
    if (departureTimeArray[1].indexOf("PM") !== -1) {
      departureTimeArray[0] = (parseInt(departureTimeArray[0], 10) % 12) + 12;
    }
    var arrivalTimeArray = row
      .querySelector(".faresColumn2")
      .textContent.trim()
      .split(":");
    if (arrivalTimeArray[1].indexOf("PM") !== -1) {
      arrivalTimeArray[0] = (parseInt(arrivalTimeArray[0], 10) % 12) + 12;
    }

    var startDate = new Date(
      0,
      0,
      0,
      parseInt(departureTimeArray[0], 10),
      parseInt(departureTimeArray[1], 10),
      0
    );

    var endDate = new Date(
      0,
      0,
      0,
      parseInt(arrivalTimeArray[0], 10),
      parseInt(arrivalTimeArray[1], 10),
      0
    );
    var diff = endDate.getTime() - startDate.getTime();
    var busDuration = diff / (1000 * 60 * 60);
    if (busDuration < 0) busDuration = busDuration + 24;
    debugger;
    self.insertInDom(
      self.footprintCore.getEmissionElementFromDuration(busDuration),
      row.querySelector(".faresColumn4")
    );
  });
};

var WebsiteManager = boltBusManager;
