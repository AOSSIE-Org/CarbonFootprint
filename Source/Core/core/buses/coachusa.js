var coachUSABusManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "canada";
  this.validator = new BusValidator("coachusa");
  this.footprintCore.storeBusEmissionData(this.dataSource);
  this.footprintCore.storeBusSpeedData(this.dataSource);
};

coachUSABusManager.prototype.setStyle = function(emission) {
  emission.style.color = "black";
  return emission;
};

coachUSABusManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

coachUSABusManager.prototype.update = function() {
  if (
    document.querySelectorAll(".schedule-table-container table tr").length === 0
  )
    return;
  var self = this;
  document
    .querySelectorAll(".schedule-table-container table tr")
    .forEach(function(row) {
      if (!row.querySelector("td[nowrap=true]")) return;
      if (row.getElementsByClassName("carbon").length !== 0) return;
      debugger;
      var timeArray = row.querySelectorAll("td[nowrap=true]");
      var startTime = timeArray[0].textContent.trim().split(":");
      if (startTime[1].indexOf("p") > 0) {
        startTime[0] = (parseInt(startTime[0]) % 12) + 12;
      }
      startTime = startTime.map(function(timeElement) {
        return parseInt(timeElement);
      });
      var endTime = timeArray[timeArray.length - 1].textContent
        .trim()
        .split(":");
      if (endTime[1].indexOf("p") > 0) {
        endTime[0] = (parseInt(endTime[0]) % 12) + 12;
      }
      endTime = endTime.map(function(timeElement) {
        return parseInt(timeElement);
      });
      var startDate = new Date(0, 0, 0, startTime[0], startTime[1], 0);
      var endDate = new Date(0, 0, 0, endTime[0], endTime[1], 0);
      var diff = endDate.getTime() - startDate.getTime();
      var busDuration = diff / (1000 * 60 * 60);
      if (busDuration < 0) busDuration = busDuration + 24;
      debugger;
      self.insertInDom(
        self.footprintCore.getEmissionElementFromDuration(busDuration),
        row.querySelectorAll("td")[row.querySelectorAll("td").length - 1]
      );
    });
};

var WebsiteManager = coachUSABusManager;
