class boltBusManager{
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "america";
    this.validator = new BusValidator("boltbus");
    this.subtree = true;
    this.footprintCore.storeBusEmissionData(this.dataSource);
    this.footprintCore.storeBusSpeedData(this.dataSource);
  }
  setStyle(emission) {
    emission.style.fontSize = "2rem";
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
    if (document.querySelectorAll("table.fareview").length === 0) return;
    this.validator.querySelectorAll("table.fareview tr").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;
      if (row.getElementsByClassName("faresColumn1").length === 0) return;

      const departureTimeArray = this.validator
        .querySelector(".faresColumn1", row)
        .textContent.trim()
        .split(":");
      if (departureTimeArray[1].indexOf("PM") !== -1) {
        departureTimeArray[0] = (parseInt(departureTimeArray[0], 10) % 12) + 12;
      }
      const arrivalTimeArray = this.validator
        .querySelector(".faresColumn2", row)
        .textContent.trim()
        .split(":");
      if (arrivalTimeArray[1].indexOf("PM") !== -1) {
        arrivalTimeArray[0] = (parseInt(arrivalTimeArray[0], 10) % 12) + 12;
      }

      const startDate = new Date(
        0,
        0,
        0,
        parseInt(departureTimeArray[0], 10),
        parseInt(departureTimeArray[1], 10),
        0
      );

      const endDate = new Date(
        0,
        0,
        0,
        parseInt(arrivalTimeArray[0], 10),
        parseInt(arrivalTimeArray[1], 10),
        0
      );
      const diff = endDate.getTime() - startDate.getTime();
      let busDuration = diff / (1000 * 60 * 60);
      if (busDuration < 0) busDuration = busDuration + 24;
      this.insertInDom(
        this.footprintCore.getEmissionElementFromDuration(busDuration),
        this.validator.querySelector(".faresColumn4", row)
      );
    });
  }
}

const WebsiteManager = boltBusManager;
