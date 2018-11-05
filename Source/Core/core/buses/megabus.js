class megabusBusManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "america";
    this.validator = new BusValidator("megabus");
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
    if (document.querySelectorAll(".ticket").length === 0) return;
    this.validator.querySelectorAll(".ticket").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;
      debugger;
      var busDurationArray = this.validator
        .querySelector(".ticket__summary__text", row)
        .textContent.trim()
        .split(" ");
      var busDuration =
        parseInt(busDurationArray[0], 10) +
        parseInt(busDurationArray[1], 10) / 60;
      debugger;
      this.insertInDom(
        this.footprintCore.getEmissionElementFromDuration(busDuration),
        this.validator.querySelector(".ticket__time", row)
      );
    });
  }
}

var WebsiteManager = megabusBusManager;
