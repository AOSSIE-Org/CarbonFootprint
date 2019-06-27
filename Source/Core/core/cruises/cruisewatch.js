class cruisewatchCruiseManager {
    constructor(footprintCore, settingsProvider) {
      this.footprintCore = footprintCore;
      this.footprintCore.storeCruiseEmissionData();
      this.settingsProvider = settingsProvider;
      this.validator = new CruiseValidator("cruisewatch");
    }
  
    setStyle(emission) {
      emission.style.fontSize = "10px";
      emission.style.border = "1px solid blue";
      emission.style.padding = "3px";
      emission.style.marginTop = "10px";
      return emission;
    }
  
    insertInDom(emission, element) {
      emission = this.setStyle(emission);
      if (element.getElementsByClassName("carbon").length === 0) {
        element.appendChild(emission);
      }
    }
  
    update() {
      if (document.querySelectorAll(".col-md-6.card.section-redirect.section-click-tracking").length === 0) return;
  
      var self = this;
  
      this.validator.querySelectorAll(".col-md-6.card.section-redirect.section-click-tracking").forEach(row => {
        if (row.getElementsByClassName("carbon").length !== 0) return;
  
        var cruiseDuration = parseInt(
          row.querySelector(".heading-sm.heading-secondary.card-title").innerText.trim().split(" ")[0]
        );
        
        self.insertInDom(
          self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
          self.validator.querySelector(".rating-holder", row)
        );
      });
    }
  }
  
  var WebsiteManager = cruisewatchCruiseManager;
  