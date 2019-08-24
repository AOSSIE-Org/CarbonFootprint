class easternBusManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "america";
    this.subtree = "true";
    this.validator = new BusValidator("flixbus");
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
    // if (!document.getElementById("schedule_selector")) return;

    this.validator
      .querySelectorAll(".result-date-container > div > div >div.ride--unbooked")
      .forEach(row => {
        timeOutRequired = false;
        if (row.getElementsByClassName("carbon").length !== 0) return;
        var busDurationArray = this.validator
          .querySelector('#results-group-container-direct div.col-xs-12.duration.ride__duration.ride__duration-messages', row)
          .innerText.trim().split(':')
          
          console.log("duration array", busDurationArray)
        var busDuration =
          parseInt(busDurationArray[0], 10) + parseInt(busDurationArray[1], 10)/60;

        console.log(busDuration)
        this.insertInDom(
          this.footprintCore.getEmissionElementFromDuration(busDuration),
          this.validator.querySelector(".dept-arr", row)
        );
      });
  }
}

var WebsiteManager = easternBusManager;
