class seahubCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.validator = new CruiseValidator("seahub");
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

<<<<<<< HEAD
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
=======
  update() {
    if (document.querySelectorAll(".results-table-group-content").length === 0) return;

    var self = this;

    this.validator.querySelectorAll(".results-table-group-content").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;

      var cruiseDuration = parseInt(
        row.querySelector(".results-table-group-title").innerText.split(" ")[0]
      );
      
      self.insertInDom(
        self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
        self.validator.querySelector(".results-table-group-from-price", row)
      );
    });
>>>>>>> 67f9c333c3802e1a5379785482c9e29202dfd0ba
  }
}

var WebsiteManager = seahubCruiseManager;
