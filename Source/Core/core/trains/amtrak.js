class amtrackRailManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "america";
    this.MODE = ["amtrack"];
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("amtrack");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("america");
  }

  setStyle(emission) {
    emission.querySelector("a").style.color = "#fffff4";
    emission.style.float = "left";
    emission.style["padding-top"] = "3px";
    emission.style["margin-left"] = "1em";
    return emission;
  }

  insertInDom(emission, element) {
    element = this.validator.querySelector(
      ".row.header_no_margin.row-divided.train_detail_row .column-one",element
    );
    emission = this.setStyle(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (document.querySelectorAll(".container-fluid").length === 0) return;
    document.querySelectorAll(".train-select-heading").forEach(row => {
      if (!row.querySelector(".container-fluid")) return;
      if (row.getElementsByClassName("carbon").length !== 0) return;
      var trainName = "amtrack";
      debugger;
      var trainDurationArray = this.validator
        .querySelector(".ff_seg_duration", row)
        .textContent.split(" ");
      var trainDuration =
        parseInt(
          trainDurationArray[0]
            .split("")
            .slice(1)
            .join(""),
          10
        ) +
        parseInt(trainDurationArray[1], 10) / 60;
      debugger;
      if (!trainSpeedData[trainName]) trainName = "average";
      distanceBetween = trainSpeedData[trainName] * trainDuration;
      this.insertInDom(this.footprintCore.getEmission([this.MODE]), row);
    });
  }
}

var WebsiteManager = amtrackRailManager;
