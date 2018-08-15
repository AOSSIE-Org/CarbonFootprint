var busData;
var busEmissionData;

class wanderuManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "america"; //select one of the emission information sources from trainEmissions.json
    this.stations = {
      arrive: "",
      depart: ""
    };
    this.subtree = true;
    this.validator = new TrainsValidator("wanderu");
    this.footprintCore.storeDataSource(this.dataSource);
    debugger;
    this.footprintCore.getData(
      this.footprintCore.helper.getFilePath(
        "core/resources/busesEmissions.json"
      ),
      data => {
        busEmissionData = data["america"];
        console.log(busEmissionData);
      }
    );
    this.footprintCore.getData(
      this.footprintCore.helper.getFilePath("core/resources/buses.json"),
      data => {
        busData = data["america"];
        console.log(busData);
      }
    );
    this.footprintCore.storeTrainSpeed("america");
  }

  setStyle(emission) {
    emission.style.margin = "0 1em";
    emission.style.display = "inline";
    return emission;
  }

  insertInDom(emission, element) {
    element = element.querySelector(".duration-isD35");
    emission = this.setStyle(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
    }
  }

  update() {
    if (document.querySelectorAll(".search-result-component").length === 0)
      return;

    document.querySelectorAll(".search-result-component").forEach(row => {
      if (row.getElementsByClassName("carbon").length !== 0) return;
      if (!row.querySelector(".modesAndDetailsContainer-2UCxL svg")) {
        if (row.querySelector(".spinner-2BYWJ.loaderContainer-AcoWE")) return;
        var bus = Boolean(row.querySelector("img[alt=bus]"));
        var train = Boolean(row.querySelector("img[alt=train]"));
        var emission = 0;
        debugger;

        var startTime = row
          .querySelector(".time-1ZF-5.depart-13UFM")
          .textContent.trim()
          .split("");
        var endTime = row
          .querySelector(".time-1ZF-5.arrive-34qer")
          .textContent.trim()
          .split("");

        if (startTime[startTime.length - 2] === "P") {
          startTime = startTime.join("").split(":");
          startTime[0] = (Number(startTime[0]) % 12) + 12;
        } else startTime = startTime.join("").split(":");
        startTime = startTime.map(e => parseInt(e, 10));
        if (endTime[endTime.length - 2] === "P") {
          endTime = endTime.join("").split(":");
          endTime[0] = (Number(endTime[0]) % 12) + 12;
        } else endTime = endTime.join("").split(":");
        endTime = endTime.map(e => parseInt(e, 10));
        var startDate = new Date(0, 0, 0, startTime[0], startTime[1], 0);
        var endDate = new Date(0, 0, 0, endTime[0], endTime[1], 0);
        var diff = endDate.getTime() - startDate.getTime();
        var duration = diff / (1000 * 60 * 60);
        if (duration < 0) duration = duration + 24;

        if (train) {
          distanceBetween = trainSpeedData["average"] * duration;
          emission = trainData["average"] * distanceBetween;
        } else {
          distanceBetween = busData["average"] * duration;
          emission = busEmissionData["average"] * distanceBetween;
        }
        this.insertInDom(this.footprintCore.createHTMLElement(emission), row);
        return;
      }
      if (!row.querySelector("table.tripDetailsTableContainer-1L_hJ")) return;
      bus = Boolean(row.querySelector("img[alt=bus]"));
      train = Boolean(row.querySelector("img[alt=train]"));
      emission = 0;
      if ((bus || train) && !(bus && train)) {
        var allrows = row.querySelectorAll("tbody tr");
        var overallDuration = 0;
        allrows.forEach((tr, index) => {
          if (tr.querySelector("td:nth-child(3)").textContent) {
            var startTime = tr
              .querySelector("td:nth-child(3)")
              .textContent.trim()
              .split("");
            var endTime = allrows[index + 1]
              .querySelector("td:nth-child(2)")
              .textContent.trim()
              .split("");
            if (startTime[startTime.length - 2] === "P") {
              startTime = startTime.join("").split(":");
              startTime[0] = (Number(startTime[0]) % 12) + 12;
            } else startTime = startTime.join("").split(":");
            startTime = startTime.map(e => parseInt(e, 10));
            if (endTime[endTime.length - 2] === "P") {
              endTime = endTime.join("").split(":");
              endTime[0] = (Number(endTime[0]) % 12) + 12;
            } else endTime = endTime.join("").split(":");
            endTime = endTime.map(e => parseInt(e, 10));
            var startDate = new Date(0, 0, 0, startTime[0], startTime[1], 0);
            var endDate = new Date(0, 0, 0, endTime[0], endTime[1], 0);
            var diff = endDate.getTime() - startDate.getTime();
            var duration = diff / (1000 * 60 * 60);
            if (duration < 0) duration = duration + 24;
            overallDuration += duration;
          }
        });
        if (train) {
          distanceBetween = trainSpeedData["average"] * overallDuration;
          emission = trainData["average"] * distanceBetween;
        } else {
          distanceBetween = busData["average"] * overallDuration;
          emission = busEmissionData["average"] * distanceBetween;
        }
        this.insertInDom(this.footprintCore.createHTMLElement(emission), row);
        return;
      } else if (bus && train) {
        var busDuration = 0;
        var trainDuration = 0;
        allrows = row.querySelectorAll("tbody tr");
        overallDuration = 0;
        allrows.forEach((tr, index) => {
          if (tr.querySelector("td:nth-child(3)").textContent) {
            var mode =
              tr.querySelector("td:nth-child(5)").textContent.indexOf("Train") >
              0
                ? "train"
                : "bus";
            var startTime = tr
              .querySelector("td:nth-child(3)")
              .textContent.trim()
              .split("");
            var endTime = allrows[index + 1]
              .querySelector("td:nth-child(2)")
              .textContent.trim()
              .split("");
            if (startTime[startTime.length - 2] === "P") {
              startTime = startTime.join("").split(":");
              startTime[0] = (Number(startTime[0]) % 12) + 12;
            } else startTime = startTime.join("").split(":");
            startTime = startTime.map(e => parseInt(e, 10));
            if (endTime[endTime.length - 2] === "P") {
              endTime = endTime.join("").split(":");
              endTime[0] = (Number(endTime[0]) % 12) + 12;
            } else endTime = endTime.join("").split(":");
            endTime = endTime.map(e => parseInt(e, 10));
            var startDate = new Date(0, 0, 0, startTime[0], startTime[1], 0);
            var endDate = new Date(0, 0, 0, endTime[0], endTime[1], 0);
            var diff = endDate.getTime() - startDate.getTime();
            var duration = diff / (1000 * 60 * 60);
            if (duration < 0) duration = duration + 24;
            if (mode === "train") trainDuration += duration;
            else busDuration += duration;
          }
        });
        distanceBetween = trainSpeedData["average"] * trainDuration;
        emission += trainData["average"] * distanceBetween;
        distanceBetween = busData["average"] * busDuration;
        emission += busEmissionData["average"] * distanceBetween;
        this.insertInDom(this.footprintCore.createHTMLElement(emission), row);
        return;
      }
    });
  }
}

var WebsiteManager = wanderuManager;
