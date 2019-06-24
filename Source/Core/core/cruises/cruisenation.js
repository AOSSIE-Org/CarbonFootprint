class cruisenationCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.validator = new CruiseValidator("cruisenation");
  }

  setStyle(emission) {
    emission.style.fontSize = "15px";
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
    if (document.querySelectorAll("article.search-result").length === 0) return;

    var self = this;

    this.validator.querySelectorAll("article.search-result").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;

      var cruiseDuration = parseInt(
        row
          .querySelector(
            "div.product-info > div:nth-child(2) > span.product-info__departing-date"
          )
          .innerText.trim()
          .split(" ")[0]
      );

      self.insertInDom(
        self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
        self.validator.querySelector("div.product-info > div:nth-child(3)", row)
      );
    });
  }
}

var WebsiteManager = cruisenationCruiseManager;
