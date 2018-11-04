class viarailManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "canada"; //select one of the emission information sources from trainEmissions.json
    this.MODE = ["viarail"]; // Currently average data is available only. Hence using general IRCTC name..
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("viarail");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("canada");
  }

  setStyle(emission) {
    emission.style.fontSize = "inherit";
    emission.style.margin = "0 6.4em";
    emission.style.padding = "0";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (document.querySelectorAll(".train-route-container").length === 0) return;
    this.validator.querySelectorAll(".train-route-container").forEach(row => {
      if (row.getElementsByClassName("carbon").length != 0) return;
      var trainName = "viarail";
      var trainDurationArray = this.validator
        .querySelector(".schedule-info-duration", row)
        .textContent.trim()
        .split(" ");
      var trainDuration =
        parseInt(
          trainDurationArray[0]
            .split("")
            .splice(8)
            .join(""),
          10
        ) +
        parseInt(trainDurationArray[2], 10) / 60;
      debugger;
      if (!trainSpeedData[trainName]) trainName = "average";
      distanceBetween = trainSpeedData[trainName] * trainDuration;
      this.insertInDom(this.footprintCore.getEmission([this.MODE]), row);
    });
  }
}

var WebsiteManager = viarailManager;
