const scraperObject = {
  url: "https://maclife.vn/",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    // Navigate to the selected page
    await page.goto(this.url);
    let scrapedData = [];
    // Wait for the required DOM to be rendered
    async function scrapeCurrentPage() {
      await page.waitForSelector(".modern-articles");

      let urls = await page.$$eval(".content-art", (links) => {
        //  links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
        links = links.map((el) => el.querySelector("a").href);
        return links;
      });
      console.log(urls);
      // Loop through each of those links, open a new page instance and get the relevant data from them
      let pagePromise = (link) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let newPage = await browser.newPage();
          await newPage.goto(link);
          dataObj["apptile"] = await newPage.$eval(
            ".article-title",
            (text) => text.textContent
          );
          dataObj["appdate"] = await newPage.$eval(
            ".single-date",
            (text) => text.textContent
          );
          // dataObj["appcategory"] = await newPage.$eval(".meta-art", (text) => {
          //   text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
          //   let regexp = /^.*\((.*)\).*$/i;
          //   let appcategory = regexp.exec(text)[1].split(" ")[0];
          //   return appcategory;
          // });
          dataObj["imageUrl"] = await newPage.$eval(
            ".media-single-content img",
            (img) => img.src
          );
          dataObj["appDescription"] = await newPage.$eval(
            "article",
            (div) => div.nextSibling.nextSibling.textContent
          );
          // dataObj["upc"] = await newPage.$eval(
          //   ".table.table-striped > tbody > tr > td",
          //   (table) => table.textContent
          // );
          resolve(dataObj);
          await newPage.close();
        });

      for (link in urls) {
        let currentPageData = await pagePromise(urls[link]);
        scrapedData.push(currentPageData);
        console.log(currentPageData);
      }

      let nextButtonExist = false;
      try {
        const nextButton = await page.$eval(
          ".nextpostslink",
          (a) => a.textContent
        );
        nextButtonExist = true;
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
