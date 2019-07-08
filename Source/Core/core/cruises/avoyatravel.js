class avoyatravelCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.validator = new CruiseValidator("avoyatravel");
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
    if (document.querySelectorAll(".flex.flex-col.border.mt-4").length === 0)
      return;

    var self = this;

    this.validator
      .querySelectorAll(".flex.flex-col.border.mt-4")
      .forEach(row => {
        if (row.getElementsByClassName("carbon").length !== 0) return;

        var cruiseDuration = parseInt(
          row
            .querySelector("button.text-left.text-xl.font-bold.text-blue")
            .innerText.trim()
            .split("-")[0]
        );

        self.insertInDom(
          self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
          self.validator.querySelector(".py-1.text-center.mb-2", row)
        );
      });
  }
}

var WebsiteManager = avoyatravelCruiseManager;
