var greyhoundBusManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "america";
  this.validator = new BusValidator("greyhound");
  this.footprintCore.storeBusEmissionData(this.dataSource);
  this.footprintCore.storeBusSpeedData(this.dataSource);
};

greyhoundBusManager.prototype.setStyle = function(emission) {
  emission.style.color = "black";
  emission.style.position = "absolute";
  emission.style["padding-top"] = "0";
  emission.style["font-size"] = "smaller";
  return emission;
};

greyhoundBusManager.prototype.insertInDom = function(emission, element) {
  if (element.querySelector(".verified .carbon")) return;
  emission = this.setStyle(emission);
  if (element.querySelector(".carbon") && emission.classList.length !== 1)
    return;
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
    return;
  }
  if (
    element.querySelectorAll(".verified .carbon").length === 0 &&
    emission.classList.length === 1
  ) {
    element.removeChild(element.querySelector("#carbon-footprint-label"));
    element.appendChild(emission);
    return;
  }
};
greyhoundBusManager.prototype.update = function() {
  if (!document.querySelectorAll(".fare")) return;
  var self = this;
  document.querySelectorAll(".fare").forEach(function(row) {
    if (row.getElementsByClassName("carbon verified").length !== 0) return;
    debugger;
    var busDurationArray = self.validator
      .querySelector(".trip-duration", row)
      .textContent.trim()
      .split(" ");
    var busDuration =
      parseInt(busDurationArray[0], 10) +
      parseInt(busDurationArray[1], 10) / 60;
    if (row.querySelector(".timeline")) {
      debugger;
      var excludedTime = 0;
      row.querySelectorAll(".stop-information").forEach(function(stop) {
        var durationStop = stop.querySelectorAll("li")[2];
        if (durationStop) {
          excludedTimeArray = durationStop
            .querySelector("strong")
            .textContent.trim()
            .split(" ");
          if (excludedTimeArray.length === 2)
            excludedTime +=
              parseInt(excludedTimeArray[0], 10) +
              parseInt(excludedTimeArray[1], 10) / 60;
          else {
            if (excludedTimeArray[0].indexOf("h") === -1)
              excludedTime += parseInt(excludedTimeArray[0], 10) / 60;
            else excludedTime += parseInt(excludedTimeArray[0], 10);
          }
        }
      });
      busDuration -= excludedTime;
      var emissionElement = self.footprintCore.getEmissionElementFromDuration(
        busDuration
      );
      emissionElement.classList.add("verified");
      self.insertInDom(
        emissionElement,
        row.querySelector(".details.table-cell")
      );
      return;
    }
    if (row.getElementsByClassName("carbon").length === 0) {
      self.insertInDom(
        self.footprintCore.getEmissionElementFromDuration(busDuration),
        row.querySelector(".details.table-cell")
      );
      return;
    }
  });
};

var WebsiteManager = greyhoundBusManager;
