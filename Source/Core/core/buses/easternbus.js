class easternBusManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "america";
    this.subtree = "true";
    this.validator = new BusValidator("easternbus");
    this.footprintCore.storeBusEmissionData(this.dataSource);
    this.footprintCore.storeBusSpeedData(this.dataSource);
  }

  setStyle(emission) {
    emission.style.color = "black";
    emission.style["padding-top"] = "0";
    emission.style["margin"] = "auto";
    emission.style["font-size"] = "smaller";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (!document.getElementById("schedule_selector")) return;
    this.validator
      .querySelectorAll("#schedule_selector .schedule_stripe")
      .forEach(row => {
        timeOutRequired = false;
        if (row.getElementsByClassName("carbon").length !== 0) return;
        var busDurationArray = this.validator
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
        this.insertInDom(
          this.footprintCore.getEmissionElementFromDuration(busDuration),
          this.validator.querySelector(".time", row)
        );
      });
  }
}

var WebsiteManager = easternBusManager;
