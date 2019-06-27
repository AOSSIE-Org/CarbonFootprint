class toursforfunCruiseManager {
    constructor(footprintCore, settingsProvider) {
      this.footprintCore = footprintCore;
      this.footprintCore.storeCruiseEmissionData();
      this.settingsProvider = settingsProvider;
      this.validator = new CruiseValidator("toursforfun");
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
      if (document.querySelectorAll(".list-product-item.list_product_item_info_wrap.product_click.ga_tour_code").length === 0) return;
  
      var self = this;
  
      this.validator.querySelectorAll(".list-product-item.list_product_item_info_wrap.product_click.ga_tour_code").forEach(row => {
        if (row.getElementsByClassName("carbon").length !== 0) return;
  
        var cruiseDuration = parseInt(
          row.querySelector(".list_item_info_main .list_item_info_desc div:nth-child(3) span.info_main_item_text").innerText.split(" ")[0]
        );
        
        self.insertInDom(
          self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
          self.validator.querySelector(".info_related_price .price_info", row)
        );
      });
    }
  }
  
  var WebsiteManager = toursforfunCruiseManager;
  