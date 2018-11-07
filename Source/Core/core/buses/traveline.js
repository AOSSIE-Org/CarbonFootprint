class travelineBusManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.dataSource = "uk";
    this.validator = new BusValidator("traveline");
    this.subtree = true;
    this.footprintCore.storeBusEmissionData(this.dataSource);
    this.footprintCore.storeBusSpeedData(this.dataSource);
    debugger;
  }

  setStyle(emission) {
    emission.style.padding = "0";
    this.validator.querySelector("a", emission).setAttribute("style", "color:black !important; font-size:1.2rem;");
    return emission;
  }

  insertInDom(emission, element) {
    emission = this.setStyle(emission);
    debugger;
    var td = document.createElement("td");
    td.appendChild(emission);
    if (element.getElementsByClassName("carbon").length === 0) {
      element.insertBefore(td, this.validator.querySelector(".next", element));
    }
  }

  update() {
    if (document.querySelectorAll(".journey-summary").length === 0) return;
    if (
        document.querySelector(".journey-summaries table thead tr th:nth-child(4)")
        .textContent !== "CO2 emission"
    ) {
      var th = document.createElement("th");
      th.textContent = "CO2 emission";
      this.validator.querySelector(".journey-summaries table thead tr")
        .insertBefore(
          th,
          this.validator.querySelector(
            ".journey-summaries table thead tr th:nth-child(4)"
          )
        );
    }
    this.validator
      .querySelector(".journey-summary.break td")
      .setAttribute("colspan", 8);
    this.validator.querySelectorAll(".journey-summary").forEach(row => {
      if (!row.querySelector(".next")) return;
      if (row.getElementsByClassName("carbon").length !== 0) return;
      var busDurationArray = this.validator
        .querySelector(".next", row)
        .textContent.trim()
        .split(":");
      var busDuration =
        parseInt(busDurationArray[0], 10) +
        parseInt(busDurationArray[1], 10) / 60;
      debugger;
      this.insertInDom(
        this.footprintCore.getEmissionElementFromDuration(busDuration),
        row
      );
    });
  }
}

var WebsiteManager = travelineBusManager;
