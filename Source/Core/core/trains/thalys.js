class thalysManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "sncf"; //select one of the emission information sources from trainEmissions.json
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.MODE = "thalys"; // constant, the type of train on this website is only "thalys"
    this.validator = new TrainsValidator("thalys");
    this.footprintCore.storeDataSource(this.dataSource);
  }

  geocodeStations() {
    this.stations.depart = this.validator.getByClass("gare-depart")[0].innerText;
    this.stations.arrive = this.validator.getByClass("gare-arrivee")[0].innerText;
    this.validator.verifyStation(this.stations.depart);
    this.validator.verifyStation(this.stations.arrive);
    console.log(this.stations.depart + " ->  " + this.stations.arrive);
    if(distanceBetween === 0 && this.stations.depart && this.stations.arrive){  //Check if geocode never happened for current stations, proceed if not
      var toGeocode = [this.stations.depart, this.stations.arrive];
      this.footprintCore.geocode(toGeocode);
    }
  }

  setStyle(emission) {
    emission.style.marginLeft = "10px";
    emission.style.fontSize = "small";
    return emission;
  }

  insertInDom(emission) {
    emission = this.setStyle(emission);
    console.log(emission);
    var element = this.validator.getById("telecommande");
    if(element.getElementsByClassName('carbon').length === 0){
      element.appendChild(emission);
    }
  }

  update() {
    var processedList = this.geocodeStations();
    if(distanceBetween > 1){ //Check if station have alredy been geocoded
      this.insertInDom(this.footprintCore.getEmission([this.MODE])); //There is only 1 type of train
    }
  }
}

var WebsiteManager = thalysManager;
