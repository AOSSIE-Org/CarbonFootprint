var easternBusManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "america";
  this.subtree = "true";
  this.validator = new BusValidator("easternbus");
  this.footprintCore.storeBusEmissionData(this.dataSource);
  this.footprintCore.storeBusSpeedData(this.dataSource);
};

easternBusManager.prototype.setStyle = function(emission) {
  emission.style.color = "black";
  emission.style["padding-top"] = "0";
  emission.style["margin"] = "auto";
  emission.style["font-size"] = "smaller";
  return emission;
};

easternBusManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};
easternBusManager.prototype.update = function() {
  if (!document.getElementById("schedule_selector")) return;
  var self = this;
  document
    .querySelectorAll("#schedule_selector .schedule_stripe")
    .forEach(function(row) {
      timeOutRequired = false;
      if (row.getElementsByClassName("carbon").length !== 0) return;
      var busDurationArray = self.validator
        .querySelector("span[sid=durationTime]", row)
        .textContent.trim()
        .split(" ");
      var busDuration;
      if (busDurationArray.length === 2)
        busDuration =
          parseInt(busDurationArray[0], 10) +
          parseInt(busDurationArray[1], 10) / 60;
      else {
        if (busDurationArray[0].indexOf("h") === -1)
          busDuration = parseInt(busDurationArray[0], 10) / 60;
        else busDuration = parseInt(busDurationArray[0], 10);
      }
      self.insertInDom(
        self.footprintCore.getEmissionElementFromDuration(busDuration),
        row.querySelector(".time")
      );
    });
};

var WebsiteManager = easternBusManager;
