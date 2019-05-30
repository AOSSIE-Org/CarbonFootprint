class seahubCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    // this.dataSource = "seahub";
    this.validator = new CruiseValidator("seahub");
    // this.footprintCore.storeCruiseEmissionData(this.dataSource);
    // this.footprintCore.storeCruiseSpeedData(this.dataSource);
  }

  setStyle(emission) {
    emission.style.fontSize = "2rem";
    emission.style.color = "black";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() { 
    if (document.querySelectorAll(".results-table-group-title").length === 0)
      return;

    var self = this;

    this.validator
      .querySelectorAll(".results-table-group-title")
      .forEach(row => {
        console.log(row);
        console.log(parseInt(row.innerText.split(" ")[0]));
      //   if (row.getElementsByClassName("carbon").length !== 0) return;

      //   //snew
      //   for (var i = 0; i < els.size; i++) {
      //     console.log(parseInt(els[i].innerText.split(" ")[0]));
      //   }

      //   var cruiseDurationArray = self.validator
      //     .querySelector(".ticket__summary__text", row)
      //     .textContent.trim()
      //     .split(" ");

      //   var cruiseDuration =
      //     parseInt(cruiseDurationArray[0], 10) +
      //     parseInt(cruiseDurationArray[1], 10) / 60;

      //   self.insertInDom(
      //     self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
      //     self.validator.querySelector(".ticket__time", row)
      //   );
      });
  }
}

var WebsiteManager = seahubCruiseManager;
