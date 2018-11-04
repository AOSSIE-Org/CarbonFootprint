class sjManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "europe";
    this.MODE = ["sj"];
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("sj");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("europe");
  }

  setStyle(emission) {
    emission.style.fontSize = "small";
    return emission;
  }

  insertInDom(emission, element) {
    debugger;
    emission = this.setStyle(emission);
    console.log(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (document.querySelectorAll(".timetable__table-rows.ng-scope").length === 0)
      return;
    this.validator
      .querySelectorAll(".timetable__table-rows.ng-scope")
      .forEach(row => {
        if (row.getElementsByClassName("carbon").length != 0) return;
        var trainDurationArray = this.validator
          .querySelector(
            ".timetable__extra-info-item.ng-isolate-scope.ng-binding",
            row
          )
          .textContent.trim()
          .split(":")
          .map(e => parseInt(e));
        var trainDuration = trainDurationArray[1] / 60 + trainDurationArray[0];

        distanceBetween = trainSpeedData["sj"] * trainDuration;
        this.insertInDom(
          this.footprintCore.getEmission([this.MODE]),
          this.validator.querySelector(".timetable__extra-info span.ng-binding", row)
        ); //There is only 1 type of train
      });
  }
}

var WebsiteManager = sjManager;
