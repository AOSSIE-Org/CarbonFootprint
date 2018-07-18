var greyhoundAustraliaBusManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.dataSource = "australia";
  this.validator = new BusValidator("greyhoundaustralia");
  this.footprintCore.storeBusEmissionData(this.dataSource);
  this.footprintCore.storeBusSpeedData(this.dataSource);
};

greyhoundAustraliaBusManager.prototype.setStyle = function(emission) {
  emission.style.color = "black";
  emission.style.position = "absolute";
  emission.style.top = "0";
  emission.style.width = "fit-content";
  emission.style["padding-top"] = "0.6em";
  emission.style["padding-right"] = "1em";
  emission.style["padding-left"] = "1em";
  emission.style["font-size"] = "1em";
  emission.style["margin-left"] = "-1em";
  return emission;
};

greyhoundAustraliaBusManager.prototype.insertInDom = function(
  emission,
  element
) {
  if (element.querySelector(".carbon")) return;
  emission = this.setStyle(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
    return;
  }
};
greyhoundAustraliaBusManager.prototype.update = function() {
  if (!document.querySelectorAll(".trip-item .trip-summary")) return;
  var self = this;
  document.querySelectorAll(".trip-item .trip-summary").forEach(function(row) {
    debugger;
    var busDurationArray = self.validator
      .querySelector(
        ".trip-duration.center-block.text-center .trip-duration.center-block.text-center span",
        row
      )
      .textContent.trim()
      .split(" ");
    var busDuration = 0;
    busDurationArray.forEach(function(durationElement) {
      if (durationElement.indexOf("d") > 0) {
        busDuration += parseInt(durationElement) * 24;
        return;
      }
      if (durationElement.indexOf("h") > 0) {
        busDuration += parseInt(durationElement);
        return;
      }
      if (durationElement.indexOf("m") > 0) {
        busDuration += parseInt(durationElement) / 60;
        return;
      }
    });
    if (row.getElementsByClassName("carbon").length === 0) {
      self.insertInDom(
        self.footprintCore.getEmissionElementFromDuration(busDuration),
        row.querySelector(
          ".col-sm-offset-6.col-sm-6.trip-expand.container-bleed"
        )
      );
      return;
    }
  });
};

var WebsiteManager = greyhoundAustraliaBusManager;
