class directlinecruisesCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.validator = new CruiseValidator("directlinecruises");
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
    if (document.querySelectorAll("#ResultsContainer .item-list").length === 0)
      return;

    var self = this;

    this.validator
      .querySelectorAll("#ResultsContainer .item-list")
      .forEach(row => {
        if (row.getElementsByClassName("carbon").length !== 0) return;

        var cruiseDuration = parseInt(
          row
            .querySelector("span.item-lest-main-title")
            .innerText.trim()
            .split(" ")[0]
        );

        self.insertInDom(
          self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
          self.validator.querySelector(".item-list-detail", row)
        );
      });
  }
}

var WebsiteManager = directlinecruisesCruiseManager;
