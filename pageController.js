const maclife = require("./pageScraper");
const wikifx = require("./wikifx/wikifxScraper");

async function scrapeAll(browserInstance,whichwebsite) {
  let browser; 
  try {
    browser = await browserInstance;
    switch (whichwebsite) {
      case 'maclife':
        await maclife.scraper(browser);
      case 'wikifx':
        await wikifx.scraper(browser);
      default:
        console.log(`Sorry, we are out of ${expr}.`);
    }
    
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance,whichwebsite) => scrapeAll(browserInstance,whichwebsite);

// const pageScraper = require('./pageScraper');
// async function scrapeAll(browserInstance){
//     let browser;
//     try{
// 		browser = await browserInstance;
// 		let scrapedData = {};
// 		scrapedData['Travel'] = await pageScraper.scraper(browser, 'Travel');
// 		scrapedData['HistoricalFiction'] = await pageScraper.scraper(browser, 'Historical Fiction');
// 		scrapedData['Mystery'] = await pageScraper.scraper(browser, 'Mystery');
// 		await browser.close();
// 		console.log(scrapedData)
// 	}
// 	catch(err){
// 		console.log("Could not resolve the browser instance => ", err);
// 	}
// }

// module.exports = (browserInstance) => scrapeAll(browserInstance)
