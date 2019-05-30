class orbitzCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.validator = new CruiseValidator("orbitz");
  }

  setStyle(emission) {
    emission.style.fontSize = "14px";
    emission.style.border = "1px solid blue";
    emission.style.padding = "3px";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (document.querySelectorAll(".flex-content").length === 0) return;

    var self = this;

    this.validator.querySelectorAll(".flex-content").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;

      var cruiseDuration = parseInt(
        row.querySelector(".title-on-ship-image").innerText.split(" ")[0]
      );
      
      self.insertInDom(
        self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
        self.validator.querySelector(".sailing-pricing-container-left", row)
      );
    });
  }
}

var WebsiteManager = orbitzCruiseManager;
