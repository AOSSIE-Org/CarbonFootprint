class cruisedirectCruiseManager {
    constructor(footprintCore, settingsProvider) {
      this.footprintCore = footprintCore;
      this.footprintCore.storeCruiseEmissionData();
      this.settingsProvider = settingsProvider;
      this.validator = new CruiseValidator("cruisedirect");
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
      if (document.querySelectorAll(".promotion.box-shadow.margin15.clearfix").length === 0) return;
  
      var self = this;
  
      this.validator.querySelectorAll(".promotion.box-shadow.margin15.clearfix").forEach(row => {
        if (row.getElementsByClassName("carbon").length !== 0) return;
  
        var cruiseDuration = parseInt(
          row.querySelector(".iternery-heading").innerText.trim().split(" ")[0]
        );
        
        self.insertInDom(
          self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
          self.validator.querySelector(".text-rate", row)
        );
      });
    }
  }
  
  var WebsiteManager = cruisedirectCruiseManager;
  