var murraysBusManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "australia";
  this.validator = new BusValidator("murrays");
  this.subtree = true;
  this.footprintCore.storeBusEmissionData(this.dataSource);
  this.footprintCore.storeBusSpeedData(this.dataSource);
};

murraysBusManager.prototype.setStyle = function(emission) {
  emission.style.padding = "0";
  emission.style.color = "black";
  return emission;
};

murraysBusManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

murraysBusManager.prototype.update = function() {
  if (document.querySelectorAll(".trChooseTime").length === 0) return;
  var self = this;
  document.querySelectorAll(".trChooseTime").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length !== 0) return;

    debugger;
    var departureTimeArray = row
      .querySelector("td:nth-child(1) time")
      .textContent.trim()
      .split(":");
    if (departureTimeArray[1].indexOf("pm") !== -1) {
      departureTimeArray[0] = (parseInt(departureTimeArray[0], 10) % 12) + 12;
    }
    var arrivalTimeArray = row
      .querySelector("td:nth-child(2) time")
      .textContent.trim()
      .split(":");
    if (arrivalTimeArray[1].indexOf("pm") !== -1) {
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
      row.querySelector("td:nth-child(1) > time")
    );
  });
};

var WebsiteManager = murraysBusManager;
