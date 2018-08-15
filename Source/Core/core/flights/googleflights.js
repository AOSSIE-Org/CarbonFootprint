class googleFlightsManager {
    constructor(footprintCore, settingsProvider) {
      this.core = footprintCore;
      this.settingsProvider = settingsProvider;
      this.validator = new FlightsValidator("google");
    }

    /**
     * Function for making an object of flight
     * @return {object} processedList
     * Note : for 'all airport' case the first airport for depart or(or and) arrive shown in the url is considered.
     */

    getList() {
        console.log("Hey Google Flights!");
        var rawList = document.querySelectorAll(".gws-flights-results__collapsed-itinerary.gws-flights-results__itinerary");
        console.log(rawList);
        console.log("--raw list--");
        //console.log(rawList);
        var processedList = [];
        var depart;
        var arrive;
        var stops=[];
        var detail;
        for(var x=0; x< rawList.length; x++){
            var airportElement = this.validator.querySelector(".gws-flights-results__airports",rawList[x]).textContent.split("–").map(e=>e.trim());
            detail = rawList[x].querySelector(".gws-flights-results__itinerary-stops.gws-flights__ellipsize");
            console.log(detail);
            var stopsLength = parseInt(detail.querySelector("div").textContent);
            if(!Number.isNaN(stopsLength)){
                stops= rawList[x].querySelector(".gws-flights-results__layover-time").textContent.split(",").map(e=>e.trim());
            }else stops=[];
            //In the case of city having more than one airport
            // we try to find exact airport by not considering URL
            console.log(airportElement,airportElement.length);
            if(airportElement.length>0 && airportElement[0].length >0){
                depart = airportElement[0];
                arrive = airportElement[1];
            }
            console.log(depart,arrive);
            processedList.push({
                depart,
                arrive,
                stops,
                aircraft: "A380"
            });
            //console.log(stops);
        }
        console.log(processedList);
        return processedList;
    }

    /**
     * Function for inserting Element in DOM
     * @param {array} processedList
     * @return {array} processedList
     */

    insertInDom(processedList) {
        var checkOption = document.querySelectorAll('.gws-flights-results__collapsed-itinerary.gws-flights-results__itinerary');
        if(checkOption.length==0)return;
        var alter = [];
        for(var x=1;x<checkOption.length-1;x++){
            alter.push(checkOption[x]);
        }
        checkOption = alter;
        var insertIn = [];
        console.log(checkOption);
        console.log(processedList);
        for(x =0;x<checkOption.length;x++){
            console.log(checkOption[x].getElementsByClassName('carbon'));
            insertIn = checkOption[x].getElementsByClassName('gws-flights-results__price')[0];
            console.log(x);
            if(checkOption[x].getElementsByClassName('carbon').length < 1)
            {
                console.log("here we are");
                console.log(insertIn);
                var child = this.core.createMark(processedList[x].co2Emission,0);
                child.style["font-size"]="0.799em";
                child.style["padding"]="0";
                insertIn.appendChild(child);
            }
            else{
                console.log("saved");
            }
        }
    }
}

var WebsiteManager = googleFlightsManager ;
