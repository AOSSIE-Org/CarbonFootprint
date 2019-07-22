class hipmunkManager {
    constructor(footprintCore, settingsProvider) {
     this.core = footprintCore;
     this.settingsProvider = settingsProvider;
     this.validator = new FlightsValidator("hipmunk");
    }

    /**
    * Function for making an object of flight
    * @return array of Object
    */

    getList() {
        console.log("Hey Hipmunk!");
        var rawList = document.getElementsByClassName('FlightResultsListDesktop__row');
        console.log("--raw list--");
        //console.log(rawList);
        var processedList = [];
        var route;
        var airports=[];
        var depart;
        var arrive;
        var stops=[];
        if(rawList.length){
          depart = this.validator.getByClass('flight-tab-chart-header__city-name m-left')[0].innerText;
          arrive = this.validator.getByClass('flight-tab-chart-header__city-name m-right')[0].innerText;
        }
        for(var x=0; x< rawList.length; x++){
            airports = rawList[x].getElementsByClassName('FlightRoutingBar__layover');
            stops = [];
            for(var y=0;y<airports.length;y++){
                stops.push(airports[y].innerText);
            }
            processedList.push({
                depart,
                arrive,
                stops,
                aircraft: "A380"
            });
            //console.log(stops);
        }
        this.validator.verifyList(processedList);
        console.log(processedList);
        return processedList;
    }

    /**
    * Function for inserting Element in DOM
    * @param array
    * @return array
    */

    insertInDom(processedList) {
      if(processedList.length){
        var checkOption = this.validator.getByClass('FlightRowLeftColumn__airline-with-cabin');
        var box = this.validator.getByClass('FlightRowLeftColumn__airline-with-cabin');
        var insertIn = [];
        
        for(var x=0;x<checkOption.length;x++){
            insertIn = checkOption[x];
            if(checkOption[x].getElementsByClassName('carbon').length < 1)
            {
                insertIn.appendChild(this.core.createMark(processedList[x].co2Emission));
            }
            else{
                console.log("saved");
            }
        }
      }
    }
}

var WebsiteManager = hipmunkManager ;
