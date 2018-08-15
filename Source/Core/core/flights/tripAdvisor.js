class tripAdvisorManager {
  constructor(footprintCore, settingsProvider) {
    this.core = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.childList = false;
    this.validator = new FlightsValidator("tripAdvisor");
  }

  getList() {
    var rawList = document.getElementsByClassName("outerItineraryWrapper");
    console.log("raw list");
    console.log(rawList);
    var processedList = [];
    if(rawList.length){
      var seatType = this.validator.getByClass("travelersAndCos")[0].innerHTML;
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
    for(var x = 0, i = rawList.length; x < i; x++){
      flights = this.validator.getByClass("segmentDescriptionWithDiagram", rawList[x]);
      rawStops = rawList[x].getElementsByClassName("segmentDetail");
      console.log("----raw stops----");
      console.log(rawStops);
      for(var y = 0, j = flights.length; y < j; y++){
        processedList.push({
          depart: this.validator.getByClass("departureDescription", flights[y])[0].innerText.split(" ")[0],
          arrive: this.validator.getByClass("arrivalDescription", flights[y])[0].innerText.split(" ")[0],
          stops: [],
          aircraft: "A380", //hardcoded for now
          updated: false
        });
        if(rawStops.length){
          var legs = this.validator.getByClass("legDescription", rawStops[y]);
          var aircrafts = [];
          var stops = [];
          for(z = 0, k = legs.length; z < k; z++){
            var info = this.validator.getChildNode([2, 0], legs[z]);
            aircrafts.push(info.innerText);
            stops.push(this.validator.getByClass("endpointAirport", info)[0].innerText.split(" ")[0]);
          }
          stops.pop();
          processedList[processedList.length - 1].stops = stops;
          processedList[processedList.length - 1].aircrafts = aircrafts;
        }
      }
    }
    console.log("--- initial list ---");
    console.log(processedList);
    return processedList;
  }

  insertInDom(processedList) {
    insertIn = [];
    if(processedList.length > 0){
      insertIn = document.getElementsByClassName("mainFlightInfo");
    }
    if(processedList.length == insertIn.length){
      for(var x = 0, i = insertIn.length; x < i; x++){
        if(insertIn[x].getElementsByClassName("carbon").length === 0){
          insertIn[x].appendChild(this.core.createMark(processedList[x].co2Emission));
        }
        else{
          insertIn[x].removeChild(insertIn[x].childNodes[insertIn[x].childNodes.length - 1]);
          insertIn[x].appendChild(this.core.createMark(processedList[x].co2Emission));
        }
      }
    }
    else{
      var y = 0;
      for( x = 0, i = insertIn.length; x < i; x++){
        if(insertIn[x].getElementsByClassName("carbon").length === 0){
          insertIn[x].appendChild(this.core.createMark(processedList[y].co2Emission, processedList[y+1].co2Emission));
          y += 2;
        }
        else{
          insertIn[x].removeChild(insertIn[x].childNodes[insertIn[x].childNodes.length - 1]);
          insertIn[x].appendChild(this.core.createMark(processedList[y].co2Emission, processedList[y+1].co2Emission));
          y += 2;
        }
      }
    }
  }
}

var WebsiteManager = tripAdvisorManager;
