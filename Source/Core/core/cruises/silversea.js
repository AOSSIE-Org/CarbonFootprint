class silverseaCruiseManager {
    constructor(footprintCore, settingsProvider) {
      this.footprintCore = footprintCore;
      this.footprintCore.storeCruiseEmissionData();
      this.settingsProvider = settingsProvider;
      this.validator = new CruiseValidator("silversea");
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
      if (document.querySelectorAll(".c-fyc-v2__result").length === 0) return;
  
      var self = this;
  
      this.validator.querySelectorAll(".c-fyc-v2__result").forEach(row => {
        if (row.getElementsByClassName("carbon").length !== 0) return;
  
        var cruiseDuration = parseInt(
          row.querySelector(".c-fyc-v2__result__content__summary__item.c-fyc-v2__result__content__summary__item__duration").innerText.trim().split(" ")[0]
        );
        
        self.insertInDom(
          self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
          self.validator.querySelector(".c-fyc-v2__result__content__price__notWaitList", row)
        );
      });
    }
  }
  
  var WebsiteManager = silverseaCruiseManager;
  