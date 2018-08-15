class deltaManager {
  constructor(footprintCore, settingsProvider) {
    this.core = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.validator = new FlightsValidator("delta");
  }

  getList() {
    var rawList = document.getElementsByClassName("mainContentCard p0-md-up");
    console.log("raw list");
    console.log(rawList);
    var processedList = [];
    for(var x = 0, i = rawList.length; x < i; x++){
      var stops = [];
      rawStops = rawList[x].getElementsByClassName("flightSecFocus").length > 0 ? this.validator.getByClass("flightSecFocus",rawList[x]): [];
      for(var y = 1, j = rawStops.length-1; y < j; y++){
        stops.push(rawStops[y].firstChild.textContent.trim());
      }
      processedList.push({
        depart: this.validator.getByClass("flightSecFocus", rawList[x])[0].firstChild.textContent.trim(),
        arrive: this.validator.getByClass("flightSecFocus", rawList[x])[j].firstChild.textContent.trim(),
        stops,
        aircraft: "A380" //hardcoded for now
      });
    }
    console.log("--- initial list ---");
    console.log(processedList);
    this.validator.verifyList(processedList);
    return processedList;
  }

  insertInDom(processedList) {
    if(processedList.length > 0){
      insertIn = document.getElementsByClassName("col-12 partnerText");
      for(var x = 0, i = insertIn.length; x < i; x++){
        if(insertIn[x].getElementsByClassName("carbon").length === 0){
             var ele = this.core.createMark(processedList[x].co2Emission);
             ele.style.display = "inline-block";
             ele.style.float = "right";

             insertIn[x].appendChild(ele);
        }
        //console.log(insertIn[x].childNodes[1].childNodes[1]);
      }
    }
  }
}

var WebsiteManager = deltaManager;
