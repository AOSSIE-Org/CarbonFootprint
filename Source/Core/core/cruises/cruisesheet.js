class cruisesheetCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.validator = new CruiseValidator("cruisesheet");
  }

  setStyle(emission) {
    emission.style.fontSize = "9px";
    emission.style.padding = "1px";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    // console.log(1)
    var btn = document.querySelector('button.btn.btn-danger.pull-right.btn-lg.form-control.do-search')
    // console.log(btn);
    if (document.querySelectorAll(".cruiseblock.row").length === 0) return;

    var self = this;

    this.validator.querySelectorAll(".cruiseblock.row").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;
      var cruiseDuration = parseInt(
        row
          .querySelector("span.nights")
          .innerText
      );

      // debugger;

      self.insertInDom(
        self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
        self.validator.querySelector(".buttons.col-xs-7.col-sm-5", row)
      );
    });
  }
}

var WebsiteManager = cruisesheetCruiseManager;
