var puppeteer = require("puppeteer");
process.env.CHROME_BIN = puppeteer.executablePath();
module.exports = function(config) {
  config.set({
    browsers: ["ChromeHeadlessNoSandbox"],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox","--disable-web-security"]
      }
    },
    frameworks: ["jasmine"],
    files: [
      {
        pattern: "Source/**/*.json",
        included: false,
        served: true,
        watched: false,
        nocache: true
      },
      "Build/test/storageManager.js",
      "Build/test/CarbonFootprintCommon.js",
      "Build/test/TrainsCarbonFootprintCore.js",
      "Build/test/flightDataHelper.js",
      "Build/test/FlightsFootprintCommon.js",
      "Build/test/FlightsCarbonFootprintCore.js",
      "Build/test/MapsCarbonFootprintCore.js",
      "Build/test/basicValidator.js",
      "Build/test/flightsValidator.js",
      "Build/test/mapsValidator.js",
      "Build/test/trainsValidator.js",
      "Build/test/inform.js",
      "Build/test/SentryServerMock.js",
      "Build/test/MockHelper.js",
      "Build/test/**/*Spec.js"
    ],
    proxies: {
      "core/resources/airplanes.json":
        "/base/Source/Core/core/resources/airplanes.json",
      "core/resources/airports.json":
        "/base/Source/Core/core/resources/airports.json",
      "pages/data/settings.json": "/base/Source/Core/pages/data/settings.json",
      "/core/resources/airplanes.json":
        "/base/Source/Core/core/resources/airplanes.json",
      "/core/resources/airports.json":
        "/base/Source/Core/core/resources/airports.json",
      "/pages/data/settings.json": "/base/Source/Core/pages/data/settings.json"
    },
    reporters: ["mocha"],
    logLevel: config.LOG_WARN
  });
};
