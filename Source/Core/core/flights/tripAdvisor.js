class tripAdvisorManager {
  constructor(footprintCore, settingsProvider) {
    this.core = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.childList = false;
    this.validator = new FlightsValidator("tripAdvisor");
  }

  getList() {
    var rawList = document.getElementsByClassName("flights-search-results-itinerary-card-components-OneWayInfo__container--47EGv");
    console.log("raw list");
    console.log(rawList);
    var processedList = [];
    if(rawList.length){
      var seatType = this.validator.getByClass("flights-cos-pax-picker-CosPaxPicker__cosText--3ZL-B")[0].innerHTML;
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
      flights = this.validator.getByClass("flights-search-results-itinerary-card-components-OneWayInfo__odAirline--EXFOh", rawList[x]); //deoart and arrive
      rawStops = rawList[x].getElementsByClassName("flights-search-results-itinerary-card-components-OneWayInfo__stops--1wF5n");
      console.log("----raw stops----");
      console.log(rawStops);
      for(var y = 0, j = flights.length; y < j; y++){
        processedList.push({
          depart: this.validator.querySelectorAll("span", flights[y])[0].innerText.split(" ")[0],
          arrive: this.validator.querySelectorAll("span", flights[y])[0].innerText.split(" ")[0],
          stops: [],
          aircraft: "A380", //hardcoded for now
          updated: false
        });
        if(rawStops.length){
          var legs = this.validator.querySelectorAll("span", rawStops[y]);
          var aircrafts = [];
          var stops = [];
          for(z = 0, k = legs.length; z < k; z++){
            var info = legs[z]
            aircrafts.push(info.innerText);
            stops.push(info.innerText.split(" ")[0]);
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
      insertIn = document.getElementsByClassName("flights-search-results-itinerary-card-components-RightCTAColumn__rightColumn--UzYbV ");
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
