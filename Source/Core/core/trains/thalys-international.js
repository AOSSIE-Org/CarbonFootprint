class thalysManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "sncf"; //select one of the emission information sources from trainEmissions.json
    this.speedDataSource = "europe"; //select one of the speed information sources from trains.json

    this.stations = {
      arrive: "",
      depart: ""
    };
    this.MODE = "thalys"; // constant, the type of train on this website is only "thalys"
    this.validator = new TrainsValidator("thalys");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("europe");
  }

  setStyle(emission) {
    emission.style.marginLeft = "10px";
    emission.style.fontSize = "small";
    return emission;
  }

  insertInDom(emission, row) {
    emission = this.setStyle(emission);
    console.log(emission);
    var element = this.validator.getByClass("rt-connection-logos", row)[0];
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    debugger;
    document.querySelectorAll(".rt-connection").forEach(row => {
      if (row.getElementsByClassName("carbon").length != 0) return;
      var trainDuration =
        Number(
          this.validator
            .querySelector(".rt-connection-info-duration.selectorDuration", row)
            .textContent.split(":")[0]
        ) +
        Number(
          this.validator
            .querySelector(".rt-connection-info-duration.selectorDuration", row)
            .textContent.split(":")[1]
        ) /
          60;
      distanceBetween = trainDuration * trainSpeedData["thalys"];
      this.insertInDom(this.footprintCore.getEmission([this.MODE]), row); //There is only 1 type of train
    });
  }
}

var WebsiteManager = thalysManager;
