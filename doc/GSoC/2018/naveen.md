<div style='{text-align:center;}'><h1>GSoC-2018 Contribution - by Naveen</h1>

This summer has been awesome contributing to AOSSIE working with awesome mentors. Got to develop my skillset further by a level in the field of web technology.

I  contributed to the [Carbon Footprint](https://gitlab.com/aossie/CarbonFootprint) project.
<strong> Project URL </strong> : https://gitlab.com/aossie/CarbonFootprint

The goals I completed during GSoC are :-

* <strong>Improve error detection by syncronising with sentry every 24 hours.</strong>

	<i>Related MRs </i> :

	* [Improve error detection to sync with sentry.io every 24 hours to know which websites are not working](https://gitlab.com/aossie/CarbonFootprint/merge_requests/245)  <strong><i>Merged</i></strong>  : Improved the error detection so that the working websites sync with sentry every 24 hours. Previously the free limit of sentry.io used to cross very easily, after implementation of this feature, the limis will not be crossed, as the website which are not working are disable on all the clients simultaneously.


* <strong>Add support for Railways</strong>

	<i>Related MR </i> :

	* [Added support for Indian Railways](https://gitlab.com/aossie/CarbonFootprint/merge_requests/246)  <strong><i>Merged</i></strong>  : Added support for Indian railways (IRCTC, yatra, goibibo) and did the addition of related datasets.

	* [Added support for European Railways](https://gitlab.com/aossie/CarbonFootprint/merge_requests/247)  <strong><i>Merged</i></strong>  : Added support for thalys-international, acprail, bahn.de, eurostar-international, italotreno, lefrecce, nsb, raileurope, sj.se, transwa

	* [Added support for UK trains](https://gitlab.com/aossie/CarbonFootprint/merge_requests/248)  <strong><i>Merged</i></strong>  : Added support for kayak, amtrak (US), virgintrains, redspottedhanky, nationalrail, southernrailway, nswtrainlink, thetrainline

	* [Added datasets required for future and added support for railway from canada and greece and bus support](https://gitlab.com/aossie/CarbonFootprint/merge_requests/248)  <strong><i>Merged</i></strong>  : Added datasets for bus emission, their average speed, trains emission and their average speed, and added support for wanderu(both bus and train), viarail and trainose, firstbus,natinalexpress,ourbus,traveline,washingtondeluxe.

* <strong>Bus website support for extension</strong>

	<i>Related MRs </i> :
	* [Added support for all the buses](https://gitlab.com/aossie/CarbonFootprint/merge_requests/250)  <strong><i>Merged</i></strong>  : Added support for greyHound Australia, murrays australia, coachUSA, greyhound canada, coachcanada


* <strong>Enhancing the quality of development code/experience.</strong>

  <i>Related MR </i> :
  * [Converted all the source code to ES6](https://gitlab.com/aossie/CarbonFootprint/merge_requests/251)  <strong><i>(Open MR)</i></strong> Added support for ES6 code (using babel).. Also made the file stream global.
using babel on every file could increase a result in build time, but it increased only by a few seconds, as the stream was global and once files were converted to ES5 by babel all gulp had to do was to take the stream and store that into it's location. All the code is transpiled automatically on build time hence improving developer experience. Since ES6, testing is not supported in phantomJS, removed PhantomJS, and added chromeHeadless as testing browser.


* <strong>Fixing any error which occured due to change in structure of websites.</strong>

    <i>Related MR </i> :
    * [Fixes all broken sites](https://gitlab.com/aossie/CarbonFootprint/merge_requests/252)  <strong><i>(Open MR)</i></strong> This MR resolved all the errors occurring in the previous services built in to the extension.

