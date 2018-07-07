var washingtonDeluxeManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "america";
  this.validator = new BusValidator("washingtondeluxe");
  this.subtree = true;
  this.footprintCore.storeBusEmissionData(this.dataSource);
  this.footprintCore.storeBusSpeedData(this.dataSource);
  debugger;
};

washingtonDeluxeManager.prototype.setStyle = function(emission) {
  emission.style.color = "black";
  return emission;
};

washingtonDeluxeManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

washingtonDeluxeManager.prototype.update = function() {
  debugger;
  if (document.querySelectorAll(".reserv_table_sched").length === 0) return;
  var self = this;
  document.querySelectorAll(".reserv_table_sched").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length !== 0) return;
    debugger;
    // As website is used only for route between NYC and Washington DC
    var busDuration = 364;
    debugger;
    self.insertInDom(
      self.footprintCore.getEmissionElementFromDistance(busDuration),
      row.querySelector("td:nth-child(6)")
    );
  });
  document.querySelectorAll(".reserv_table_sched_last").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length !== 0) return;
    debugger;
    // As website is used only for route between NYC and Washington DC
    var busDuration = 364;
    debugger;
    self.insertInDom(
      self.footprintCore.getEmissionElementFromDistance(busDuration),
      row.querySelector("td:nth-child(6)")
    );
  });
};

var WebsiteManager = washingtonDeluxeManager;
