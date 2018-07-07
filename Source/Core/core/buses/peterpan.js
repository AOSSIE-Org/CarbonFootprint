var peterpanBusManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "america";
  this.validator = new BusValidator("peterpan");
  this.footprintCore.storeBusEmissionData(this.dataSource);
  this.footprintCore.storeBusSpeedData(this.dataSource);
  this.subtree = true;
};

peterpanBusManager.prototype.setStyle = function(emission) {
  emission.style.color = "black";
  emission.style.position = "absolute";
  emission.style["padding-top"] = "0.5em";
  emission.style["font-size"] = "smaller";
  return emission;
};

peterpanBusManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};
peterpanBusManager.prototype.update = function() {
  debugger;
  ifrm = document.querySelector("iframe");
  var iframeDocument = document;
  if (iframeDocument.querySelectorAll(".fineborder").length === 0) return;
  var self = this;
  iframeDocument.querySelectorAll(".fineborder").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length !== 0) return;
    debugger;
    var timeTD = row.querySelectorAll("td")[6];
    if (!timeTD) return;

    var busDuration = Number(timeTD.getAttribute("sorting")) / 60;
    self.insertInDom(
      self.footprintCore.getEmissionElementFromDuration(busDuration),
      timeTD
    );
  });
};

var WebsiteManager = peterpanBusManager;
