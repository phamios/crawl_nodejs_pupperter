var db = require('./database');

 

let currentPage = 1;
let currentItem = 0;

const scraperObject = {
  url: "https://maclife.vn/",
  async scraper(browser) {
    let page = await browser.newPage();
    // console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);
    let scrapedData = [];
    console.log(this.url);
    // Wait for the required DOM to be rendered
    async function scrapeCurrentPage() {
      await page.waitForSelector(".modern-articles");
      let urls = await page.$$eval(".content-art", (links) => {
        //  links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
        links = links.map((el) => el.querySelector("a").href);
        return links;
      });
      // console.log(urls);
      // Loop through each of those links, open a new page instance and get the relevant data from them
      let pagePromise = (link) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          currentItem = currentItem + 1;
         
            let newPage = await browser.newPage();
            await newPage.goto(link);
            console.log("Page >> " + currentPage + "  Item >> " + currentItem + " >>>>"+link);
            dataObj["apptile"] = await newPage.$eval(
              ".article-title",
              (text) => text.textContent
            );
            dataObj["appdate"] = await newPage.$eval(
              ".single-date",
              (text) => text.textContent
            );
            dataObj["imageUrl"] = await newPage.$eval(
              ".media-single-content img",
              (img) => img.src
            );
            // dataObj["appDescription"] = await newPage.$eval(
            //   ".entry",
            //   (div) => div.nextSibling.nextSibling.textContent
            // );
            dataObj["appDescription"] = await newPage.$eval(
              ".entry",
              (text) => text.textContent
            );
            // dataObj["appDescription"] = dataObj["appDescription"].replace(/(\t|)/mgu, "");
  
            // dataObj["upc"] = await newPage.$eval(
            //   ".table.table-striped > tbody > tr > td",
            //   (table) => table.textContent
            // );
            resolve(dataObj);
            if(currentItem > 161 || currentItem > 169) {
              var sql = "INSERT INTO maclife_Apps (app_title,app_image,app_url,app_description) VALUES('" + dataObj["apptile"] + "','" + dataObj["imageUrl"] + "','"+ link + "','"+ dataObj["appDescription"] + "')";
              db.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
              });
    
              await newPage.close();
            }
          
        });

      for (link in urls) {
        let currentPageData = await pagePromise(urls[link]);
        scrapedData.push(currentPageData); 
        // console.log(currentPageData);
      }

      let nextButtonExist = false;
      try {
        const nextButton = await page.$eval(
          ".nextpostslink",
          (a) => a.textContent
        );
        nextButtonExist = true;
        currentPage = currentPage + 1;
    

      } catch (err) {
        nextButtonExist = false;
      }

      if (nextButtonExist) {
        await page.click(".nextpostslink");
        return scrapeCurrentPage(); // Call this function recursively
      }
      await page.close();
      return scrapedData;
    }

    let data = await scrapeCurrentPage();
    console.log(data);
    return data;
  }
};

module.exports = scraperObject;
