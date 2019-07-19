class americandiscountcruisesCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.validator = new CruiseValidator("americandiscountcruises");
  }

  setStyle(emission) {
    emission.style.fontSize = "10px";
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
    if (document.querySelectorAll(".resultSurround").length === 0) return;

    var self = this;

    this.validator.querySelectorAll(".resultSurround").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;

      var cruiseDuration = parseInt(
        row
          .querySelector(".resultItinerary")
          .innerText.trim()
          .split(" ")[0]
      );

      self.insertInDom(
        self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
        self.validator.querySelector(".resultHdr", row)
      );
    });
  }
}

var WebsiteManager = americandiscountcruisesCruiseManager;
