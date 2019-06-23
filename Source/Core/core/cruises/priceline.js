class pricelineCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.validator = new CruiseValidator("priceline");
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
    if (document.querySelectorAll("#results ul#cruiselist li.wth2-resultsCardLi .wth2-resultsItinContainer.ui-grid-b .ui-block-b").length === 0) return;

    var self = this;

    this.validator.querySelectorAll("#results ul#cruiselist li.wth2-resultsCardLi .wth2-resultsItinContainer.ui-grid-b .ui-block-b").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;

      var cruiseDuration = parseInt(
        row.querySelector(".ui-block-c h2.wth2-brochureName").innerText.split(" ")[0]
      );
      
      self.insertInDom(
        self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
        self.validator.querySelector(".ui-block-c", row)
      );
    });
  }
}

var WebsiteManager = pricelineCruiseManager;
