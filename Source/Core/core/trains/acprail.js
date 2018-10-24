class acprailManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.validator = new TrainsValidator("acprail");
    this.footprintCore.storeTrainSpeed("europe");
    this.footprintCore.storeDataSource(this.dataSource);
  }

  setStyle(emission) {
    emission.style.fontSize = "small";
    emission.style["padding-top"] = "0";
    return emission;
  }

  insertInDom(emission, element) {
    if (element.getElementsByClassName("carbon").length !== 0) return;
    emission = this.setStyle(emission);
    var li = element.lastChild.previousSibling.cloneNode();
    if (li.appendChild) li.appendChild(emission);
    console.log(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      debugger;
      element.appendChild(li);
    }
  }

  update() {
    if (document.querySelectorAll(".table").length === 0) return;
    if (
      !(
        document.querySelector("table.table").querySelector("tr:only-child")
          .lastChild.textContent === "CO2 emission"
      )
    ) {
      var x = this.validator
      .querySelector("tr:only-child", this.validator.querySelector("table.table")
      )
        .lastChild.previousSibling.cloneNode();
      x.textContent = "CO2 emission";
      this.validator
      .querySelector("tr:only-child", this.validator.querySelector("table.table"))
      .appendChild(x);
    }
    var a_journey_class = this.validator.querySelectorAll("tbody tr.a_journey", this.validator
      .getByClass("table")[0]);

    var journey_details_class = 
    this.validator.querySelectorAll("tbody tr.journey_details",this.validator
      .getByClass("table")[0]);

    for (var i = 0; i < a_journey_class.length; i++) {
      var row = a_journey_class[i];
      var details = journey_details_class[i];
      var totalFootPrint = 0;
      details.querySelectorAll("li").forEach(row => {
        var trainNameArray = row.lastChild.textContent
          .split(" ")
          .pop()
          .split("");
        var trainName = trainNameArray
          .slice(1, trainNameArray.length - 2)
          .join("");
        trainDepartureTime = this.validator.getChildNode([4],row).textContent
          .split(" ")[2]
          .split(":");
        trainArrivalTime = this.validator.getChildNode([6],row).textContent.split(" ")[2].split(":");
        var startDate = new Date(
          0,
          0,
          0,
          trainDepartureTime[0],
          trainDepartureTime[1],
          0
        );
        var endDate = new Date(
          0,
          0,
          0,
          trainArrivalTime[0],
          trainArrivalTime[1],
          0
        );
        var diff = endDate.getTime() - startDate.getTime();
        var trainDuration = diff / (1000 * 60 * 60);
        if (trainDuration < 0) trainDuration = trainDuration + 24;
        console.log(trainDuration);
        var usingAverageSpeed = true;
        for (trainTestString in trainSpeedData) {
          trainName.split(" ").forEach(word => {
            if (
              this.footprintCore.fuzzySearch(word.toLowerCase(), trainTestString)
            ) {
              usingAverageSpeed = false;
              distanceBetween = trainDuration * trainSpeedData[trainTestString];
              return;
            }
          });
          if (!usingAverageSpeed) break;
        }
        if (usingAverageSpeed)
          distanceBetween = trainSpeedData["average"] * trainDuration;
        totalFootPrint += trainData["average"] * distanceBetween;
      });
      this.insertInDom(this.footprintCore.createHTMLElement(totalFootPrint), row);
    }
  }
}

var WebsiteManager = acprailManager;
