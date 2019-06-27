class travelocityCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.validator = new CruiseValidator("travelocity");
  }

  setStyle(emission) {
    emission.style.fontSize = "10px";
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
    if (
      document.querySelectorAll(
        ".cf.flex-1up.flex-listing.flex-theme-light.flex-collapse.cols-nested.sailing-cruise-card.sailing-card-experiment"
      ).length === 0
    )
      return;

    var self = this;

    this.validator
      .querySelectorAll(
        ".cf.flex-1up.flex-listing.flex-theme-light.flex-collapse.cols-nested.sailing-cruise-card.sailing-card-experiment"
      )
      .forEach(row => {
        if (row.getElementsByClassName("carbon").length !== 0) return;

        var cruiseDuration = parseInt(
          row
            .querySelector(".title-on-ship-image")
            .innerText.trim()
            .split(" ")[0]
        );

        self.insertInDom(
          self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
          self.validator.querySelector(".sailing-pricing-container-left", row)
        );
      });
  }
}

var WebsiteManager = travelocityCruiseManager;
