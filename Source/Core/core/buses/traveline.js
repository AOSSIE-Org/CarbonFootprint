var travelineBusManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "uk";
  this.validator = new BusValidator("traveline");
  this.subtree = true;
  this.footprintCore.storeBusEmissionData(this.dataSource);
  this.footprintCore.storeBusSpeedData(this.dataSource);
  debugger;
};

travelineBusManager.prototype.setStyle = function(emission) {
  emission.style.padding = "0";
  emission
    .querySelector("a")
    .setAttribute("style", "color:black !important; font-size:1.2rem;");
  return emission;
};

travelineBusManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  debugger;
  var td = document.createElement("td");
  td.appendChild(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.insertBefore(td, element.querySelector(".next"));
  }
};

travelineBusManager.prototype.update = function() {
  if (document.querySelectorAll(".journey-summary").length === 0) return;
  if (
    document.querySelector(".journey-summaries table thead tr th:nth-child(4)")
      .textContent !== "CO2 emission"
  ) {
    var th = document.createElement("th");
    th.textContent = "CO2 emission";
    document
      .querySelector(".journey-summaries table thead tr")
      .insertBefore(
        th,
        document.querySelector(
          ".journey-summaries table thead tr th:nth-child(4)"
        )
      );
  }
  document
    .querySelector(".journey-summary.break td")
    .setAttribute("colspan", 8);
  var self = this;
  document.querySelectorAll(".journey-summary").forEach(function(row) {
    if (!row.querySelector(".next")) return;
    if (row.getElementsByClassName("carbon").length !== 0) return;
    var busDurationArray = self.validator
      .querySelector(".next", row)
      .textContent.trim()
      .split(":");
    var busDuration =
      parseInt(busDurationArray[0], 10) +
      parseInt(busDurationArray[1], 10) / 60;
    debugger;
    self.insertInDom(
      self.footprintCore.getEmissionElementFromDuration(busDuration),
      row
    );
  });
};

var WebsiteManager = travelineBusManager;
