var db = require('../database');

//ASIC
let domaincrawl = "https://www.wikifx.com/en/regulator/0362262880.html"; 

const wikifxScraper = {
  url: domaincrawl,
  async scraper(browser) {
    let page = await browser.newPage();
    // console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);
    let scrapedData = [];
    console.log(this.url);

    const root = "https://www.wikifx.com/";
    var maincontent = ".recommend-ctx_JU4UM";
    var eachcolumn = ".ctx-list_LB1WM";
    var currentPage = 1;
    var currentItem = 0;
    var page_click_next = ".nextpostslink";
    var table_save = "maclife_Apps";


    // Wait for the required DOM to be rendered
    async function scrapeCurrentPage() {
        await page.waitForSelector(maincontent);
        let urls = await page.$$eval(eachcolumn, (links) => {
            //  links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
            links = links.map((el) => el.querySelector("a").href);
            // links = this.root + links;
            return links;
        });
        console.log(urls);
        // Loop through each of those links, open a new page instance and get the relevant data from them

          let pagePromise = (link) =>
            new Promise(async (resolve, reject) => {
              let dataObj = {};
              currentItem = currentItem + 1;
            
                let newPage = await browser.newPage();
                if ( typeof link !== 'undefined' && link || link !== 'u' )
                {
                    await newPage.goto(link);
                    console.log("Page >> " + currentPage + "  Item >> " + currentItem + " >>>>"+link);
                    dataObj["broker_name"] = await newPage.$eval(
                      ".dealer-l-title",
                      (text) => text.textContent
                    );
                    dataObj["broker_score"] = await newPage.$eval(
                      ".score-num-1",
                      (text) => text.textContent
                    );
                    dataObj["broker_information"] = await newPage.$eval(
                        ".content",
                        (text) => text.textContent
                    );
                    dataObj["broker_shortinformation"] = await newPage.$eval(
                        ".dealer-label-list-box",
                        (text) => text.textContent
                    );
    
    
                    // dataObj["imageUrl"] = await newPage.$eval(
                    //   ".media-single-content img",
                    //   (img) => img.src
                    // );
                    
                    // dataObj["appDescription"] = await newPage.$eval(
                    //   ".entry",
                    //   (div) => div.nextSibling.nextSibling.textContent
                    // );

                    // dataObj["appDescription"] = await newPage.$eval(
                    //   ".entry",
                    //   (text) => text.textContent
                    // );

                    // dataObj["appDescription"] = dataObj["appDescription"].replace(/(\t|)/mgu, "");
        
                    // dataObj["upc"] = await newPage.$eval(
                    //   ".table.table-striped > tbody > tr > td",
                    //   (table) => table.textContent
                    // );
                    resolve(dataObj);
                     
                    // var sql = "INSERT INTO " + table_save + " (app_title,app_image,app_url,app_description) VALUES('" + dataObj["apptile"] + "','" + dataObj["imageUrl"] + "','"+ link + "','"+ dataObj["appDescription"] + "')";
                    // db.query(sql, function (err, result) {
                    // if (err) throw err;
                    // console.log("1 record inserted");
                    // });
        
                    await newPage.close();
                }
                else
                {
                    console.log(link + " Can not connect");
                }
                
                
            
            });

        for (link in urls) {
            let currentPageData = await pagePromise(urls[link]);
            scrapedData.push(currentPageData); 
            console.log(currentPageData);
            
           
        }

        let nextButtonExist = false;
        try {
            const nextButton = await page.$eval(
                page_click_next,
            (a) => a.textContent
            );
            nextButtonExist = true;
            currentPage = currentPage + 1;
        

        } catch (err) {
            nextButtonExist = false;
        }

        if (nextButtonExist) {
            await page.click(page_click_next);
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

module.exports = wikifxScraper;
