class italotrenoManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
    this.MODE = ["italo"]; // Only trains of this website..
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("italo");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("europe");
  }

  setStyle(emission) {
    emission.style.fontSize = "medium";
    emission.style["text-align"] = "center";
    emission.style["padding-top"] = "0";
    emission.style["margin-top"] = "-15px";
    emission.style["margin-left"] = "-15px";

    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    console.log(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (document.querySelectorAll(".item-treno.js-item-treno").length === 0)
      return;
    document.querySelectorAll(".item-treno.js-item-treno").forEach(row => {
      if (row.getElementsByClassName("carbon").length != 0) return;
      var trainName = "italo";
      var trainDuration;
      if (!row.querySelector(".noStopLabel")) {
        trainDuration =
          Number(
            this.validator.getByClass("durata", row)[0].textContent.split(":")[0]
          ) +
          Number(
            this.validator.getByClass("durata", row)[0].textContent.split(":")[1]
          ) /
            60;
      } else {
        debugger;
        trainDuration =
          Number(
            this.validator
              .getByClass("durata", row)[0]
              .textContent.trim()
              .split(" ")[1]
              .substr(4)
              .split(":")[0]
          ) +
          Number(
            this.validator
              .getByClass("durata", row)[0]
              .textContent.trim()
              .split(" ")[1]
              .substr(4)
              .split(":")[1]
          ) /
            60;
      }
      if (trainSpeedData[trainName])
        distanceBetween = trainDuration * trainSpeedData[trainName];
      else distanceBetween = trainDuration * trainSpeedData["average"];

      this.insertInDom(this.footprintCore.getEmission([this.MODE]), row); //There is only 1 type of train
    });
  }
}

var WebsiteManager = italotrenoManager;
