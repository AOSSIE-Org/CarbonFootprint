class carnivalCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.validator = new CruiseValidator("carnival");
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
    if (
      document.querySelectorAll(
        "article.vrg-result-item.vrg-result-item--result.vrg-result-item--small"
      ).length === 0
    )
      return;

    var self = this;

    this.validator
      .querySelectorAll(
        "article.vrg-result-item.vrg-result-item--result.vrg-result-item--small"
      )
      .forEach(row => {
        if (row.getElementsByClassName("carbon").length !== 0) return;

        var cruiseDuration = parseInt(
          row
            .querySelector(".cgc-cruise-glance__days")
            .innerText.trim()
            .split(" ")[0]
        );

        self.insertInDom(
          self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
          self.validator.querySelector("span.cgc-cruise-glance", row)
        );
      });
  }
}

var WebsiteManager = carnivalCruiseManager;
