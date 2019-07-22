class seahubCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.validator = new CruiseValidator("seahub");
  }

  setStyle(emission) {
    emission.style.fontSize = "14px";
    emission.style.border = "1px solid blue";
    emission.style.padding = "3px";
    return emission;
  }

  insertInDom(emission, element) {
    debugger;
    emission = this.setStyle(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    debugger;
    if (document.querySelectorAll(".results-table-group-content").length === 0) return;

    var self = this;

    this.validator.querySelectorAll(".results-table-group-content").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;

      var cruiseDuration = parseInt(
        row.querySelector(".results-table-group-title").innerText.split(" ")[0]
      );
      debugger
      console.log("inserting")
      self.insertInDom(
        self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
        self.validator.querySelector(".results-table-group-from-price", row)
      );
    });
  }
}

var WebsiteManager = seahubCruiseManager;
