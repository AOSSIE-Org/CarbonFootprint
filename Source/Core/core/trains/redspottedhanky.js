class redspottedhankyManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
    this.MODE = ["uk"]; // Currently average data is available only. Hence using general IRCTC name..
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("redspottedhanky");
    this.footprintCore.storeDataSource(this.dataSource);
    this.footprintCore.storeTrainSpeed("europe");
  }

  setStyle(emission) {
    emission.style.fontSize = "inherit";
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    var td = document.createElement("td");
    td.classList.add("FaresViewEmptyCell");
    td.appendChild(emission);
    console.log(td);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(td);
    }
  }

  update() {
    if (
      !(
        document.querySelector("table.FaresView").querySelector("tr:only-child")
          .lastChild.textContent === "CO2 emission"
      )
    ) {
      var x = this.validator
        .querySelector("table.FaresView")
        .querySelector("th")
        .cloneNode();
      x.textContent = "CO2 emission";
      this.validator
        .querySelector("table.FaresView")
        .querySelector("tr:only-child")
        .appendChild(x);
    }
    debugger;
    this.validator.querySelectorAll(".FaresViewDetail").forEach(row => {
      if (row.getElementsByClassName("carbon").length != 0) return;

      var trainName = "redspottedhanky";
      var trainDurationArray = this.validator
        .querySelector(".FaresViewDuration", row)
        .textContent.trim()
        .split(" ");
      var trainDuration =
        parseInt(trainDurationArray[0], 10) +
        parseInt(trainDurationArray[1], 10) / 60;
      if (!trainSpeedData[trainName])
        trainName = trainSpeedData["uk"] ? "uk" : "average";
      distanceBetween = trainSpeedData[trainName] * trainDuration;
      this.insertInDom(this.footprintCore.getEmission([this.MODE]), row); //There is only 1 type of train
    });
  }
}

var WebsiteManager = redspottedhankyManager;
