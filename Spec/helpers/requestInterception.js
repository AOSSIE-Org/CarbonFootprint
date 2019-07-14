let blockImages = async (page) => {
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (['image', 'font'].indexOf(request.resourceType()) !== -1) {
            request.abort();
        } else {
            request.continue();
        }
    });
}

module.exports = {
    blockImages
}