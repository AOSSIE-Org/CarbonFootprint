class makeMyTripManager {
  constructor(footprintCore, settingsProvider) {
    this.core = footprintCore;
    this.settingsProvider = settingsProvider;
    this.validator = new FlightsValidator("makemytrip");
  }

  getList() {
    var rawList = document.getElementsByClassName("fli-list");
    console.log("raw list");
    console.log(rawList);
      // var stops = rawList.getElementsByClassName("leg-stops-station");
      // console.log("---stops---");
      // console.log(stops);
      var processedList = [];
    //console.log(rawList);
      for(var x = 0, i = rawList.length; x < i; x++){
          stops = (rawList[x].getElementsByClassName('fli-stops-desc')[0].innerText.length)? rawList[x].getElementsByClassName('fli-stops-desc')[0].innerText.split(",").join("").split(" "): [];
      processedList.push({
        depart: rawList[x].querySelector('dept-city').innerHTML,
        arrive: rawList[x].querySelector('arrival-city').innerHTML,
        stops,
        aircraft: "A380" //hardcoded for now
      });
    }
    console.log("--- initial list ---");
    console.log(processedList);
    return processedList;
  }

  insertInDom(processedList) {
    insertIn = document.getElementsByClassName("fli-list");
    for(var x = 0, i = insertIn.length; x < i; x++){
       
      insertIn[x].querySelector('.dept-options-section').appendChild(core.createHTMLElement(processedList[x].co2Emission));
    }
  }
}

var WebsiteManager = makeMyTripManager;
