class murraysBusManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "australia";
    this.validator = new BusValidator("murrays");
    this.subtree = true;
    this.footprintCore.storeBusEmissionData(this.dataSource);
    this.footprintCore.storeBusSpeedData(this.dataSource);
  }

  setStyle(emission) {
    emission.style.padding = "0";
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
    if (document.querySelectorAll(".trChooseTime").length === 0) return;
    this.validator.querySelectorAll(".trChooseTime").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;

      debugger;
      var departureTimeArray = this.validator
        .querySelector("td:nth-child(1) time", row)
        .textContent.trim()
        .split(":");
      if (departureTimeArray[1].indexOf("pm") !== -1) {
        departureTimeArray[0] = (parseInt(departureTimeArray[0], 10) % 12) + 12;
      }
      var arrivalTimeArray = this.validator
        .querySelector("td:nth-child(2) time", row)
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
      this.insertInDom(
        this.footprintCore.getEmissionElementFromDuration(busDuration),
        this.validator.querySelector("td:nth-child(1) > time", row)
      );
    });
  }
}

var WebsiteManager = murraysBusManager;
