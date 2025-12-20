Carbon Footprint for Google Maps
================================

A browser extension that displays carbon footprint information in multiple map services.

Downloading and Using the Latest Stable Version
-----------------------------------------------

To download and install the extension to your favorite browser, visit Carbon Footprint's page in your browser's extension/add-on gallery/store:

*	[Google Chrome Web Store](https://chrome.google.com/webstore/detail/carbon-footprint/ednfpjleaanokkjcgljbmamhlbkddcgh)
*	Safari (Coming soon... In the meanwhile, you can download a pre-built beta version from the "Dist" folder, or follow the instructions below to build it yourself.)
*	[Firefox Add-On Gallery](https://addons.mozilla.org/en-US/firefox/addon/carbon-footprint/)

Minimum Node Requirements
-------------------------

* ```Node >= 6.0.0```
* ```npm >= 5.3.0```

Building and Using Beta Versions
--------------------------------

* clone this repository

* run `npm install`

* run `npm run group` or `npm run groupFirefox` or `npm run groupChrome` or `npm run groupSafari` or `npm run groupWebext`

* run `npm run group:debug` or `npm run groupFirefox:debug` or `npm run groupChrome:debug` or `npm run groupSafari:debug` or `npm run groupWebext:debug` to keep all debug statements and comments.

* for chrome, load the unpacked extension from the Build/Chrome folder

* for firefox, Change directory into `Build/Firefox` and run `jpm run -b firefox_edition_name`, to use this extension in specific firefox edition (`firefox` for simple firefox browser).

* for WebExtension, Change directory into `Build/WebExtension-Firefox/` and than run `web-ext run -f firefox_edition_name` to use this extension in specific firefox edition (`firefox` for simple firefox browser).

* for safari, load folder with extension `.safariextension` into _Extension Builder_ `Develop -> Show Extension Builder`. To show _Develop_ menu go to `Safari -> Preferences -> Advanced`. Change extension metadata as required from the _Extension Builder_. To package the extension for distribution, get an extension certificate from Apple.


Testing
--------------------------------
* run `npm test` to run unit tests.
* run `npm eetest` to run all E2E tests.
* run `npm-nonci` to run E2E tests for websites which blocks bot or where the extension is not functional
* run `npm eetest-ci` to run E2E tests where extensions and tests are working as expected


Licenses
--------

* GNU-GPL-3.0

* CC-By-NC-ND [![License](https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-nd/4.0/)


Contributions
-------------

If you would like to contribute to the development of this extension, please [contact the developers](mailto:bruno.wp@gmail.com).

* [Google Summer of Code](GoogleSummerOfCode.md) grants are available every year. If you would like to apply, it is never too early to contact us.
