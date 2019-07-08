class royalcaribbeanCruiseManager {
constructor(footprintCore, settingsProvider) {
this.footprintCore = footprintCore;
this.footprintCore.storeCruiseEmissionData();
this.settingsProvider = settingsProvider;
this.validator = new CruiseValidator("royalcaribbean");
}

setStyle(emission) {
emission.style.fontSize = "12px";
emission.style.padding = "3px";
return emission;
}

insertInDom(emission, element) {
emission = this.setStyle(emission);
if (element.getElementsByClassName("carbon").length === 0) {
element.appendChild(emission);
}
}

update() {
if (document.querySelectorAll("li.collapsable").length === 0) return;

var self = this;

this.validator.querySelectorAll("li.collapsable").forEach(row => {
if (row.getElementsByClassName("carbon").length !== 0) return;

var cruiseDuration = parseInt(
row.querySelector(".itinerary-duration").innerText.trim().split(" ")[0]
);

self.insertInDom(
self.footprintCore.getEmissionElementFromDuration(cruiseDuration),
self.validator.querySelector(".itinerary-info", row)
);
});
}
}

var WebsiteManager = royalcaribbeanCruiseManager;
