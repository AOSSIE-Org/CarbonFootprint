var coachCanadaBusManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "canada";
  this.validator = new BusValidator("coachcanada");
  this.footprintCore.storeBusEmissionData(this.dataSource);
  this.footprintCore.storeBusSpeedData(this.dataSource);
};

coachCanadaBusManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "2rem";
  emission.style.color = "black";
  return emission;
};

coachCanadaBusManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

coachCanadaBusManager.prototype.update = function() {
  if (document.querySelectorAll(".ticket").length === 0) return;
  var self = this;
  document.querySelectorAll(".ticket").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length !== 0) return;
    debugger;
    var busDurationArray = self.validator
      .querySelector(".ticket__summary__text", row)
      .textContent.trim()
      .split(" ");
    var busDuration =
      parseInt(busDurationArray[0], 10) +
      parseInt(busDurationArray[1], 10) / 60;
    debugger;
    self.insertInDom(
      self.footprintCore.getEmissionElementFromDuration(busDuration),
      row.querySelector(".ticket__time")
    );
  });
};

var WebsiteManager = coachCanadaBusManager;
