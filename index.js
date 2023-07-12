const browserObject = require("./browser");
const scraperController = require("./pageController");

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();
let whichwebsite = process.argv[2];
// Pass the browser instance to the scraper controller
scraperController(browserInstance,whichwebsite);
