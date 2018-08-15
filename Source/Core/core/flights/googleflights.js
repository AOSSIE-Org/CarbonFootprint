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
        var prefix = document.querySelector("#root").classList[0].split("-")[0]; //check for the prefix of the className in google maps Body tag.
        var rawList = document.getElementsByClassName(prefix+'-d-W '+prefix+'-d-Lb '+prefix+'-d-S');
        console.log(rawList);
        console.log("--raw list--");
        //console.log(rawList);
        var processedList = [];
        var route;
        var airports=[];
        var depart;
        var arrive;
        var stops=[];
        var url;
        var detail;
        url = location.href;
        url = url.split(";");
        airports = url.slice(1,3);
        depart = airports[0].slice(2,5);
        arrive = airports[1].slice(2,5);
        for(var x=1; x< rawList.length-1; x++){
            detail = rawList[x].getElementsByClassName(prefix+'-d-Qb')[0].innerText;
            detail = detail.split(" ");
            console.log(detail);
            if(detail.length>0){
                if(!isNaN(parseInt(detail[0]))){
                    stops = rawList[x].getElementsByClassName(prefix+'-d-Z')[0].innerText.split(" ");
                    if(stops[0] === 'Change'){
                        stops = [];
                    }
                    else if(parseInt(detail[0]) != stops.length){   // handle when stops is like ["1h", "50m", "in", "AUH"]
                        console.log(stops);
                        stops = stops[stops.length-1];
                        stops = [stops];
                    }
                    else if(parseInt(detail[0])>1){
                        stops = stops.join(" ").split(",").join("").split(" ");
                    }
                }
                else{
                    stops = [];
                }
            }
            else{
                stops = [];
            }
            //In the case of city having more than one airport
            // we try to find exact airport by not considering URL
            var airportElement = rawList[x].getElementsByClassName(prefix+'-d-Ib');
            console.log(airportElement,airportElement.length);
            if(airportElement.length>0 && airportElement[0].innerText.length >0){
                airportElement = airportElement[0].innerText.split("-");
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
        var checkOption = document.getElementsByClassName('LJV2HGB-d-W LJV2HGB-d-Lb LJV2HGB-d-S');
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
            insertIn = checkOption[x].getElementsByClassName('LJV2HGB-d-X')[0];
            console.log(x);
            if(checkOption[x].getElementsByClassName('carbon').length < 1)
            {
                console.log("here we are");
                console.log(insertIn);
                insertIn.appendChild(this.core.createMark(processedList[x].co2Emission,0));
            }
            else{
                console.log("saved");
            }
        }
    }
}

var WebsiteManager = googleFlightsManager ;
