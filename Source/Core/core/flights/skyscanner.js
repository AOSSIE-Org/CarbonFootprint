class skyscannerManager {
  constructor(footprintCore, settingsProvider) {
    this.core = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.validator = new FlightsValidator("skyscanner");
  }

  getList() {
    var rawList = document.getElementsByClassName("card-main");
    if(rawList.length){
      var seatType = this.validator.getByClass("search-summary-info")[0].innerHTML;
      if(seatType.indexOf("Economy") >= 0){
        console.log(seatType.indexOf("Economy"));
        this.core.setSeatType("economy");
        console.log("economy");
      }
      else{
        this.core.setSeatType("business");
        console.log("business");
      }
    }
    console.log("raw list");
    //console.log(rawList);
    var processedList = [];
    for(var x = 0, i = rawList.length; x < i; x++){
      stops = (this.validator.getByClass('leg-stops-station', rawList[x])[0].innerText.length)? this.validator.getByClass('leg-stops-station', rawList[x])[0].innerText.split(",").join("").split(" "): [];
      processedList.push({
        depart: this.validator.getChildNode([1,0,0,1], rawList[x]).innerHTML,
        arrive: this.validator.getChildNode([1,2,0,1], rawList[x]).innerHTML,
        stops,
        aircraft: "A380" //hardcoded for now
      });
    }
    this.validator.verifyList(processedList);
    console.log("--- initial list ---");
    //console.log(processedList);
    return processedList;
  }

  insertInDom(processedList) {
    var insertIn = [];
    if(processedList.length){
      insertIn = this.validator.getByClass("card-main");
    }
    //console.log(insertIn);
    for(var x = 0, i = insertIn.length; x < i; x++){
      if(this.validator.getChildNode([1], insertIn[x]).childNodes.length <= 4 ||
         this.validator.getChildNode([1,4], insertIn[x]).className == "leg-operator" &&
         this.validator.getChildNode([1], insertIn[x]).childNodes.length <= 5){
           this.validator.getChildNode([1], insertIn[x]).appendChild(this.core.createMark(processedList[x].co2Emission));
      }
      //console.log(insertIn[x].childNodes[1].childNodes[1]);
    }
  }
}

var WebsiteManager = skyscannerManager;
