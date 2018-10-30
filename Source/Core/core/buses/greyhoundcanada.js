class greyhoundCanadaBusManager {
  constructor(footprintCore, settingsProvider) {
    this.footprintCore = footprintCore;
    this.settingsProvider = settingsProvider;
    this.subtree = true;
    this.dataSource = "canada";
    this.validator = new BusValidator("greyhoundCanada");
    this.footprintCore.storeBusEmissionData(this.dataSource);
    this.footprintCore.storeBusSpeedData(this.dataSource);
  }

  setStyle(emission) {
    emission.style.color = "black";
    emission.style.position = "absolute";
    emission.style["padding-top"] = "0.6em";
    emission.style["font-size"] = "1em";
    emission.style["margin-left"] = "-1em";
    return emission;
  }

  insertInDom(emission, element) {
    if (element.querySelector(".carbon")) return;
    emission = this.setStyle(emission);

    if (element.getElementsByClassName("carbon").length === 0) {
      element.appendChild(emission);
      return;
    }
  }

  update() {
    if (!document.querySelectorAll(".outerRow")) return;
    this.validator.querySelectorAll(".outerRow").forEach(row => {
      var busDurationArray = this.validator
        .querySelector(".ptStep2travelTimeCol", row)
        .textContent.trim()
        .split(" ");
      var busDuration = 0;
      busDurationArray.forEach(durationElement => {
        if (durationElement.indexOf("D") > 0) {
          busDuration += parseInt(durationElement) * 24;
          return;
        }
        if (durationElement.indexOf("H") > 0) {
          busDuration += parseInt(durationElement);
          return;
        }
        if (durationElement.indexOf("M") > 0) {
          busDuration += parseInt(durationElement) / 60;
          return;
        }
      });
      if (row.getElementsByClassName("carbon").length === 0) {
        this.insertInDom(
          this.footprintCore.getEmissionElementFromDuration(busDuration),
          this.validator.querySelector(".ptStep2transfersCol", row)
        );
        return;
      }
    });
  }
}

var WebsiteManager = greyhoundCanadaBusManager;
