class trenitaliaManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "europe";
    this.MODE = ["trenitalia"];
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("trenitalia");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("europe");
  }

  setStyle(emission) {
    emission.style.fontSize = "large";
    return emission;
  }

  insertInDom(emission, element) {
    element = this.validator.querySelector("td:nth-child(6)", element);
    debugger;
    emission = this.setStyle(emission);
    console.log(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (document.querySelectorAll(".table-solution-hover").length === 0) return;
    document
      .querySelectorAll(".panel .table-solution-hover")
      .forEach(row => {
        if (row.getElementsByClassName("carbon").length != 0) return;
        var trainDurationArray = this.validator
          .querySelector(".descr.duration.text-center")
          .textContent.trim()
          .split(" ")
          .map(e => parseInt(e));
        var trainDuration = trainDurationArray[1] / 60 + trainDurationArray[0];

        distanceBetween = trainSpeedData["trenitalia"] * trainDuration;
        this.insertInDom(
          this.footprintCore.getEmission([this.MODE]),
          row.querySelector("tr")
        ); //There is only 1 type of train
      });
  }
}

var WebsiteManager = trenitaliaManager;
