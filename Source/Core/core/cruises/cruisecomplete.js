class cruisecompleteCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.validator = new CruiseValidator("cruisecomplete");
  }

  setStyle(emission) {
    emission.style.fontSize = "13px";
    emission.style.padding = "2px";
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
        'div[style="margin: 5px 0px 5px 0px; padding: 0px;"]'
      ).length === 0
    )
      return;

    var self = this;

    this.validator
      .querySelectorAll('div[style="margin: 5px 0px 5px 0px; padding: 0px;"]')
      .forEach(row => {
        if (row.getElementsByClassName("carbon").length !== 0) return;

        var cruiseDuration = parseInt(
          row
            .querySelector("a:nth-child(2)")
            .innerText.trim()
            .split(" ")[0]
        );

        self.insertInDom(
          self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
          self.validator.querySelector("strong + strong", row)
        );
      });
  }
}

var WebsiteManager = cruisecompleteCruiseManager;
