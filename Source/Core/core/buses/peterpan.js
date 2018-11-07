class peterpanBusManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "america";
    this.validator = new BusValidator("peterpan");
    this.footprintCore.storeBusEmissionData(this.dataSource);
    this.footprintCore.storeBusSpeedData(this.dataSource);
    this.subtree = true;
  }

  setStyle(emission) {
    emission.style.color = "black";
    emission.style.position = "absolute";
    emission.style["padding-top"] = "0.5em";
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
    if (document.querySelectorAll(".fineborder").length === 0) return;
    this.validator.querySelectorAll(".fineborder").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;
      debugger;
      var timeTD = this.validator.querySelectorAll("td", row)[6];
      if (!timeTD) return;

      var busDuration = Number(timeTD.getAttribute("sorting")) / 60;
      this.insertInDom(
        this.footprintCore.getEmissionElementFromDuration(busDuration),
        timeTD
      );
    });
  }
}

var WebsiteManager = peterpanBusManager;
