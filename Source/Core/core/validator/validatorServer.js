/**
 * Server namespace.
 * @constructor
 */
 var Server = () => {
   Raven.config('https://e21c0743051946a899ed8d6680d1c58c@sentry.io/185232').install();
 };

/**
 * Send error report to server
 * @param {string} website
 * @param {string} error
 */

 Server.prototype.error = (website, error) => {
   console.error(error + " on " + website);
   Raven.captureMessage(error, {
     extra: {
       website,
     }
   });
 };

 /**
 * Used to sync the stored data with sentry.io
 * @param {function} cb Callback function which is supplied with the list of non-working websites
 */
 Server.syncWithSentry = function syncWithSentry(cb){
   var xhttp = new XMLHttpRequest();
   var finalObj = {};
   if ("withCredentials" in xhttp) {
       // Check if the XMLHttpRequest object has a "withCredentials" property.
       // "withCredentials" only exists on XMLHTTPRequest2 objects.
       xhttp.withCredentials = true;
     } else if (typeof XDomainRequest != "undefined") {
       // Otherwise, check if XDomainRequest.
       // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
       xhttp = new XDomainRequest();
       xhttp.withCredentials = true;
     } else {
       // Otherwise, CORS is not supported by the browser.
     }
   xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
           var errorArray = JSON.parse(this.responseText);
           cb( errorArray.map(element => element.culprit));
       }
   };
   xhttp.open("GET", "https://sentry.io/api/0/projects/aossie/carbon-footprint/issues/", true);
   xhttp.setRequestHeader("Cache-Control", "no-cache");
   xhttp.setRequestHeader("Authorization", "Bearer d401709f63d148d6af9bede4201f1364b25432e3853d48929a887bd4bc4cedff");
   xhttp.send();
 }