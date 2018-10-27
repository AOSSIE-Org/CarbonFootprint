class coachUSABusManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "canada";
    this.validator = new BusValidator("coachcanada");
    this.footprintCore.storeBusEmissionData(this.dataSource);
    this.footprintCore.storeBusSpeedData(this.dataSource);
  }

  setStyle(emission) {
    emission.style.color = "black";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (
      document.querySelectorAll(".schedule-table-container table tr").length === 0
    )
      return;
    this.validator
      .querySelectorAll(".schedule-table-container table tr")
      .forEach(row => {
        if (!row.querySelector("td[nowrap=true]")) return;
        if (row.getElementsByClassName("carbon").length !== 0) return;
        debugger;
        var timeArray = this.validator.querySelectorAll("td[nowrap=true]", row);
        var startTime = timeArray[0].textContent.trim().split(":");
        if (startTime[1].indexOf("p") > 0) {
          startTime[0] = (parseInt(startTime[0]) % 12) + 12;
        }
        startTime = startTime.map(timeElement => parseInt(timeElement));
        var endTime = timeArray[timeArray.length - 1].textContent
          .trim()
          .split(":");
        if (endTime[1].indexOf("p") > 0) {
          endTime[0] = (parseInt(endTime[0]) % 12) + 12;
        }
        endTime = endTime.map(timeElement => parseInt(timeElement));
        var startDate = new Date(0, 0, 0, startTime[0], startTime[1], 0);
        var endDate = new Date(0, 0, 0, endTime[0], endTime[1], 0);
        var diff = endDate.getTime() - startDate.getTime();
        var busDuration = diff / (1000 * 60 * 60);
        if (busDuration < 0) busDuration = busDuration + 24;
        debugger;
        this.insertInDom(
          this.footprintCore.getEmissionElementFromDuration(busDuration),
          this.validator.querySelectorAll("td", row)[this.validator.querySelectorAll("td", row).length - 1]
        );
      });
  }
}

var WebsiteManager = coachUSABusManager;
