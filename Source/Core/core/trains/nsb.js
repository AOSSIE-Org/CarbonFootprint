class nsbManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
    this.MODE = ["nsb"];
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("nsb");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("europe");
  }

  setStyle(emission) {
    emission.style.fontSize = "medium";
    return emission;
  }

  insertInDom(emission, element) {
    if (!element) return;
    emission = this.setStyle(emission);
    console.log(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    document.querySelectorAll(".itinerary-list-item").forEach(row => {
      if (row.getElementsByClassName("carbon").length != 0) return;

      var trainDuration;
      if (
        this.validator
          .querySelector(".itinerary-duration .duration", row)
          .textContent.split(" ").length === 2
      ) {
        trainDuration =
          parseInt(
            this.validator
              .querySelector(".itinerary-duration .duration", row)
              .textContent.split(" ")[0]
          ) +
          parseInt(
            this.validator
              .querySelector(".itinerary-duration .duration", row)
              .textContent.split(" ")[1]
          ) /
            60;
      } else {
        trainDuration =
          parseInt(
            this.validator
              .querySelector(".itinerary-duration .duration", row)
              .textContent.split(" ")[0]
          ) / 60;
      }
      debugger;
      distanceBetween = trainDuration * trainSpeedData["nsb"];
      var element = this.validator.querySelector("button", row);
      this.insertInDom(this.footprintCore.getEmission([this.MODE]), element); //There is only 1 type of train
    });
  }
}

var WebsiteManager = nsbManager;
