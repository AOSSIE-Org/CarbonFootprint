class pricelineManager {
    constructor(footprintCore, settingsProvider) {
      this.core = footprintCore;
      this.settingsProvider = settingsProvider;
      this.treeGrowthPerYear = 8.3;
      this.validator = new FlightsValidator("priceline");
      this.subtree = true;
    }

    /**
    * Function for making an object of flight
    * @return array of Object
    */

    getList() {
        console.log("Hey Priceline!");
        var rawList =  document.querySelectorAll('li.pcln1-retail-flight.card-style');
        console.log("raw list");
        console.log(rawList);
        var processedList = [];
        var stops;
        var depart;
        var arrive;
        var airport;
        for(var x=0; x< rawList.length; x++){
            stops = Array.from(rawList[x].querySelectorAll('p[data-test="stop-text"]')).map((e)=>e.textContent.trim().substr(0,3));
            var flag = (rawList[x].querySelector('p[data-test="stops-text-component"]'));
            if(flag && flag.textContent.indexOf("Stops")> -1)continue;

            depart = rawList[x].querySelector('abbr[data-test="left-airport-code"]').textContent;
            arrive = rawList[x].querySelector('abbr[data-test="right-airport-code"]').textContent;
            if(stops.length>0){
                stops = Array.from(stops);
            }
            else{
                console.log("no stops");
                stops = [];
            }
            processedList.push({
                depart,
                arrive,
                stops,
                aircraft: "A380"
            });
            console.log(stops);
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
        var checkOption = document.querySelectorAll('li.pcln1-retail-flight.card-style');
        var insertIn = [];
        console.log(checkOption);
        console.log(processedList);
        for(var x=0;x<checkOption.length;x++){
            console.log(checkOption[x].getElementsByClassName('carbon'));
            insertIn = this.validator.querySelector('div[data-test="main-zone"]', checkOption[x]);
            console.log(x);
            if(checkOption[x].getElementsByClassName('carbon').length < 1)
            {
                console.log("here we are");
                insertIn.appendChild(this.core.createMark(processedList[x].co2Emission,processedList[x].co2Emission));
            }
            else{
                console.log("saved");
            }
        }
      }
    }
}

var WebsiteManager = pricelineManager ;
