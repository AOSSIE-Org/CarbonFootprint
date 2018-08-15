class expediaManager {
    constructor(footprintCore, settingsProvider) {
      this.core = footprintCore;
      this.settingsProvider = settingsProvider;
      this.validator = new FlightsValidator("expedia");
      this.subtree =true;
    }

    /**
    * Function for making an object of flight
    * @return array of Object
    */

    getList() {
        console.log("Hey Expedia!");
        var rawList = document.getElementsByClassName('flight-module segment offer-listing');
        console.log("--raw list--");
        debugger;
        console.log(rawList);
        var processedList = [];
        var route;
        var airports=[];
        var depart;
        var arrive;
        var stops=[];
        for(var x=0; x< rawList.length; x++){
            details = this.validator.getByClass('secondary-content no-wrap', rawList[x])[0];
            depart = this.validator.querySelector('.visuallyhidden', details).nextSibling.textContent.trim().split(" ")[0];
            arrive = this.validator.querySelector('.visuallyhidden', details).nextSibling.textContent.trim().split(" ")[0];
            //console.log(rawList);

            stops = this.validator.getByClass('layover-stops', details[1])[0].dataset["stopLayover"].split(",");

            //console.log(airports);
            // check = this.validator.getByClass('primary', details[2])[0].innerText;
            // //console.log(check);
            // check = check.split(" ");
            // //console.log(check);
            // if(check.length===1 || details[2].getElementsByClassName('secondary').length === 0){
            //     stops = [];
            //     //console.log("no stops");
            // }
            // else{
            //     stops = this.validator.getByClass('secondary', details[2])[0].innerText;
            //     //console.log(stops);
            //     if(parseInt(check[0]) == 1){
            //     stops = stops.split(" ");
            //         stops = stops[stops.length-1];
            //         stops = [stops];
            //  }
            //     else{
            //         //console.log(stops);
            //     stops = stops.split(",").join("").split(" ");
            //  }
            // }
            // route = airports.split(" ").join("").split("-");
            // depart = route[0];
            // arrive = route[1];
            if(stops.length >2){
                stops = stops.slice(0,1);     // for more than 2 stops they dont show more stops
            }
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
        console.log(checkOption);
        debugger;
        console.log(processedList);
        for(var x=0;x<checkOption.length;x++){
            console.log(checkOption[x].getElementsByClassName('carbon'));
            console.log(x);
            if(checkOption[x].getElementsByClassName('carbon').length < 1)
            {
                console.log("here we are");
                checkOption[x].appendChild(this.core.createMark(processedList[x].co2Emission,0));
            }
            else{
                console.log("saved");
            }
        }
      }
    }
}

var WebsiteManager = expediaManager;
