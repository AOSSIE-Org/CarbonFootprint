class kayakCruiseManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.footprintCore.storeCruiseEmissionData();
    this.settingsProvider = settingsProvider;
    this.validator = new CruiseValidator("kayak");
  }

  setStyle(emission) {
    emission.style.fontSize = "10px";
    emission.style.padding=  "0";
    emission.style.marginTop=  "-8px";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    var rows = document.querySelector(
      ".Cruises-Results-React-CruiseResultsList-container"
    ).firstElementChild.children;

    if (rows.length === 0) return;

    var self = this;

    var rowsHTMLCollection = this.validator.querySelectorAll(
      ".Cruises-Results-React-CruiseResultsList-container"
    )[0].firstElementChild.children;

    var rowsArray = Array.from(rowsHTMLCollection);
    
    rowsArray.forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;
      var cruiseDuration = parseInt(
        row.children[1].firstChild.children[1].firstChild.firstChild
          .innerText.trim()
          .split(" ")[0]
      );

      var parentEl = row.children[1]
      
      self.insertInDom(
        self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
        self.validator.querySelector(
          "div",
          parentEl
        )
      );
    });
  }
}

var WebsiteManager = kayakCruiseManager;
