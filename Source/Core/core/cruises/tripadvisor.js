class tripadvisorCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.validator = new CruiseValidator("tripadvisor");
  }

  setStyle(emission) {
    emission.style.fontSize = "14px";
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
        ".cruises-cruises-list-results-Result__listingWrapper--3yL9e"
      ).length === 0
    )
      return;

    var self = this;

    this.validator
      .querySelectorAll(
        ".cruises-cruises-list-results-Result__listingWrapper--3yL9e"
      )
      .forEach(row => {
        if (row.getElementsByClassName("carbon").length !== 0) return;

        var cruiseDuration = parseInt(
          row
            .querySelector(
              ".cruises-cruises-list-results-Title__titleLink--1lCkJ.false"
            )
            .innerText.trim()
            .split(" ")[0]
        );

        self.insertInDom(
          self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
          self.validator.querySelector(
            "div.cruises-cruises-list-results-Result__colInfo--jz87C > div",
            row
          )
        );
      });
  }
}

var WebsiteManager = tripadvisorCruiseManager;
