class ouigoManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "sncf"; //select one of the emission information sources from trainEmissions.json
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.MODE = "ouigo"; // constant, the type of train on this website is only "ouigo"
    this.validator = new TrainsValidator("ouigo");
    this.footprintCore.storeDataSource(this.dataSource);
  }

  geocodeStations() {
    var stations = this.validator.getByClass("title-trajet")[0].childNodes[1].innerText;
    console.log(stations);
    this.stations.depart = stations.split("  ")[0];
    this.stations.arrive = stations.split("  ")[1];
    this.validator.verifyStation(this.stations.depart);
    this.validator.verifyStation(this.stations.arrive);
    console.log(this.stations.depart + " ->  " + this.stations.arrive);
    if(distanceBetween === 0 && this.stations.depart && this.stations.arrive){  //Check if geocode never happened for current stations, proceed if not
      var toGeocode = [this.stations.depart, this.stations.arrive];
      this.footprintCore.geocode(toGeocode);
    }
  }

  setStyle(emission) {
    //emission.style.fontSize = "medium";
    emission.style.textAlign = "center";
    return emission;
  }

  insertInDom(emission) {
    emission = this.setStyle(emission);
    console.log(emission);
    var element = this.validator.getByClass("title-trajet")[0];
    if(element.getElementsByClassName('carbon').length === 0){
      element.appendChild(emission);
    }
  }

  update() {
    this.geocodeStations();
    if(distanceBetween > 1){ //Check if station have alredy been geocoded
      this.insertInDom(this.footprintCore.getEmission([this.MODE])); //There is only 1 type of train
    }
  }
}

var WebsiteManager = ouigoManager;
