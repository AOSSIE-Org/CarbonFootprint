/**
 * initialises the extension when maps webpage is opened
 * @author Kolpa (Kolya Opahle)
 * @author PrateekGupta1509 (Prateek Gupta)
 * @author heychirag (Chirag Arora)
 */

new SettingsProvider(settingsProvider => {
    settingsProvider.addUsingDefaultListener(() => {
        var optionsUrl = Helper.getFilePath('pages/options.html');
        Helper.openUrl(optionsUrl);
        console.log('calling window open on ' + optionsUrl);
    });

    var core = new CarbonFootprintCore(settingsProvider, Helper);
    var websiteManager = new WebsiteManager(core, settingsProvider);
    var Inform = new inform();

    Helper.showPageAction(() => {
        console.log('Page Action Visible!');
    });

    //check if its a flight ticket website, assign update function if it is
    if(core.flights){
      websiteManager.update = () => {
        var processedList = websiteManager.getList();
        if(flightData.airplanesData && flightData.airportsData){
            processedList = core.getEmission(
              core.getTotalDistance(
                core.getCoordinates(processedList)));
            websiteManager.insertInDom(processedList);
        }
        console.log(processedList);
      };
    }

    /*Because some websites need it to be true while some want false,
      defaults to false if nothing specified*/
    var childList;
    if(websiteManager.childList !== undefined){
      childList = websiteManager.childList;
    }
    else{
      childList = true;
    }

    var target = document.getElementsByTagName('body')[0];

    var observer = new MutationObserver(() => {
        console.log('Observing!');
        Inform.permission(websiteManager);
    });

    observer.observe(target, {
        attributes: true,
        childList,
        characterData: true,
        subtree: websiteManager.subtree
    });
});
