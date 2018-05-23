/**
 * BasicValidator namespace.
 * @constructor
 */
var BasicValidator = function(website,type) {
  this.website = website;
  this.type = type;
  this.isWorking = true;
  this.storageManager = new storageManager();
};

/**
 * used to run funtions when something fails
 * in any website.
 * @param {string} msg
 */

BasicValidator.prototype.counterMeasure = function(msg){
  console.error("Something is wrong");
  console.error(msg);
  this.isWorking = false;
  this.updateCheck(this.isWorking);
  this.server.error(this.website, msg);
};

/**
 * Wrapper function for document.getElementsByClassName()
 * @param {string} c
 * @param {object} element
 */


BasicValidator.prototype.getByClass = function(c, element){
  console.log("website",this.website);
  console.log("type",this.type);
  if(element === undefined) element = document;
  var toGet = element.getElementsByClassName(c);
  if(toGet.length){
    console.log("got class " + c);
    if(this.isWorking) this.updateCheck(this.isWorking);
  }
  else {
    this.counterMeasure("cant get class " + c);
  }
  return toGet;
};

/**
 * Wrapper function for document.getElementById()
 * @param {string} i
 * @param {object} element
 */

BasicValidator.prototype.getById = function(i, element){
  if(element === undefined) element = document;
  var toGet = element.getElementById(i);
  if(toGet){
    console.log("got id " + i);
    if(this.isWorking) this.updateCheck(this.isWorking);
  }
  else{
    this.counterMeasure("cant get id " + i);
  }
  return toGet;
};

/**
 * Wrapper function for document.getElementsByTagNameById()
 * @param {string} t
 * @param {object} element
 */

BasicValidator.prototype.getByTag = function(t, element){
  if(element === undefined) element = document;
  var toGet = element.getElementsByTagName(t);
  if(toGet.length){
    console.log("got tag " + t);
    if(this.isWorking) this.updateCheck(this.isWorking);
  }
  else{
    this.counterMeasure("cant get tag " + t);
  }
  return toGet;
};

/**
 * Wrapper function for document.querySelector()
 * @param {string} q
 * @param {object} element
 */

BasicValidator.prototype.querySelector = function(q, element){
  if(element === undefined) element = document;
  var e = element.querySelector(q);
  if(!e){
    this.counterMeasure("invalid element");
  }
  else{
    if(this.isWorking) this.updateCheck(this.isWorking);
  }
  return e;
};

/**
 * Wrapper function for .childNodes[], gets
 * children of children as in the array
 * @param {array} children
 * @param {object} element
 */

BasicValidator.prototype.getChildNode = function(children, element){
  if(element === undefined) element = document;
  for(var x = 0, i = children.length; x < i; x++){
    if(element && element.childNodes.length){
      element = element.childNodes[children.shift()];
    }
    else{
      this.counterMeasure("invalid childNodes");
    }
  }
  if(element){
    if(this.isWorking) this.updateCheck(this.isWorking);
    return element;
  }
  else{
    this.counterMeasure("invalid childNodes");
  }
};

/**
 * check if argument is a string
 * @param {all} s
 */

BasicValidator.prototype.isString = function(s){
  if(typeof s !== 'string' || s.length === 0){
    this.counterMeasure("not a string");
  }
  else{
    if(this.isWorking) this.updateCheck(this.isWorking);
  }
};

/**
 * check if argument is a numerical value
 * @param {all} i
 */

BasicValidator.prototype.isNumber = function(i){
  if(typeof i !== 'number'){
    this.counterMeasure("not a number");
  }
  else{
    if(this.isWorking) this.updateCheck(this.isWorking);
  }
};

/**
 * Function to update the working status of website
 * @param {bool} isWorking
 */

BasicValidator.prototype.updateCheck = function(isWorking){
  console.log("validator update is running");
  var self = this;
  console.log(this.storageManager);
  this.storageManager.getStorage('data',function(data){
    debugger;
    console.log(data);
    if(!data['data'])return;
    if(!(data['data']['syncTimeStamp'] && ((Date.now() - data['data']['syncTimeStamp'])/(1000*60*60))<=24)){
      for (var id in data["data"]) {
        for (var key in data["data"][id]) {
          // initially all websites are assumed to
          // be working, except those who are passed to us
          // assuming every website will be fixed every 24 hours
          data['data'][id][key].working = true;
        }
      }
      Server.syncWithSentry(function(errorArray){
        errorArray.forEach(function(element) {
          for(var id in data["data"]){
            for(var key in data["data"][id]){
              var regex = new RegExp(data["data"][id][key]["regex"]);
              if(regex.test(element)){
                if(data['data'][id][key].working){
                  data['data'][id][key].working = false;
                }
                return;
              }
            }}
        });
        data['data']['syncTimeStamp']= Date.now();
        self.storageManager.insertStorage('data',data,function(){
          console.log("changed Data",data);
        });
      });
    }
    if(data['data'][self.type][self.website].working != isWorking){
      data['data'][self.type][self.website].working = isWorking;
      self.storageManager.insertStorage('data',data,function(){
        console.log("changed Data",data);
      });
    }
    else{
      console.log("data is stored already"); //because there is a limit on number of changes per min in chrome API
    }
  });
}
