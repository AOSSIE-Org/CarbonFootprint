class travelocityManager {
    constructor(footprintCore, settingsProvider) {
        this.core = footprintCore;
        this.settingsProvider = settingsProvider;
        this.validator = new FlightsValidator("travelocity");
      }

    /**
    * Function for making an object of flight
    * @return array of Object
    */

    getList() {
        //console.log("Hey Cleartrip!");
        var rawList = document.getElementsByClassName('flight-module segment offer-listing');
        console.log("--raw list--");
        //console.log(rawList);
        var processedList = [];
        var route;
        var airports=[];
        var depart;
        var arrive;
        var stops=[];
        for(var x=0; x< rawList.length; x++){
            details = this.validator.getByClass('grid-container standard-padding', rawList[x]);
            //console.log(rawList);
            airports = this.validator.querySelector('div[data-test-id="flight-info"]', details[0]);
            console.log(airports);
            depart = this.validator.getChildNode([2], airports).textContent.trim();
            arrive = this.validator.getChildNode([airports.childNodes.length-1], airports).textContent.trim().split(" ").slice(-1).join("");
            stops = [];
            if( airports.getElementsByClassName('stops-truncated').length > 0 ){
                    stops =  airports.getElementsByClassName('stops-truncated')[0].innerText.split(" - ");
            }else{
                stops = this.validator.getChildNode([3], airports).innerText.trim()?this.validator.getChildNode([3], airports).innerText.trim().split(" ").slice(-1):[];
            }
            //console.log(airports);
            //console.log(check);
            //console.log(check);

            depart = depart.split(" ")[0];
            // route = airports.textContent.trim().split(" ").join("").split("-");
            //console.log(depart,arrive);
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
        var checkOption = this.validator.getByClass('flight-module segment offer-listing');
        var insertIn = [];
        console.log(checkOption);
        console.log(processedList);
        for(var x=0;x<checkOption.length;x++){
            console.log(checkOption[x].getElementsByClassName('carbon'));
            insertIn = checkOption[x];
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
}

var WebsiteManager = travelocityManager ;
