class washingtonDeluxeManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "america";
    this.validator = new BusValidator("washingtondeluxe");
    this.subtree = true;
    this.footprintCore.storeBusEmissionData(this.dataSource);
    this.footprintCore.storeBusSpeedData(this.dataSource);
    debugger;
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
    debugger;
    if (document.querySelectorAll(".reserv_table_sched").length === 0) return;
    this.validator.querySelectorAll(".reserv_table_sched").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;
      debugger;
      // As website is used only for route between NYC and Washington DC
      var busDuration = 364;
      debugger;
      this.insertInDom(
        this.footprintCore.getEmissionElementFromDistance(busDuration),
        this.validator.querySelector("td:nth-child(6)",row)
      );
    });
    this.validator.querySelectorAll(".reserv_table_sched_last").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;
      debugger;
      // As website is used only for route between NYC and Washington DC
      var busDuration = 364;
      debugger;
      this.insertInDom(
        this.footprintCore.getEmissionElementFromDistance(busDuration),
        this.validator.querySelector("td:nth-child(6)", row)
      );
    });
  }
}

var WebsiteManager = washingtonDeluxeManager;
