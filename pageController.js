const pageScraper = require("./pageScraper");
async function scrapeAll(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    await pageScraper.scraper(browser);
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
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
