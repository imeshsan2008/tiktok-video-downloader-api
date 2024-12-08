require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Enable stealth mode
puppeteer.use(StealthPlugin());

const fbvideo = async (url, retries = 6) =>  {
  let attempt = 0;

  while (attempt < retries) {
    try {
      console.log(`Attempt ${attempt + 1} of ${retries}...`);
      console.log("Launching Puppeteer...");
      const browser = await puppeteer.launch({
        executablePath: puppeteer.executablePath(), // Use Puppeteer's installed Chrome
        headless: true, // Use headless mode for cloud environments
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Avoid sandboxing for compatibility
      });      const page = await browser.newPage();

      console.log("Setting timeout and navigating to fsaver...");
      await page.setDefaultNavigationTimeout(60000); // 60 seconds
      await page.goto(`https://fsaver.net/download/?url=${encodeURIComponent(url)}`, {
        waitUntil: 'load',
      });

      console.log("Waiting for the download button...");
      const buttonSelector = '.btn.download__item__info__actions__button';

      try {
        await page.waitForSelector(buttonSelector, { visible: true, timeout: 1000 }); // Adjust timeout as needed
        console.log("Download button found.");
      } catch (error) {
       await page.waitForSelector('.content__wrapper h3', { visible: true });
       await browser.close();

        return {
          

          error: 'This url type not working on this site !!',
        };

       }

      console.log("Extracting the href value and caption...");
      const data = await page.evaluate((buttonSelector) => {
        const button = document.querySelector(buttonSelector);
        const resolutionElement = button?.closest('tr')?.querySelector('td');
        const caption = document.querySelector('.download__item__caption__text');

        return {
          downloadLink: button?.getAttribute('href') || null,
          resolution: resolutionElement?.innerText || null,
          caption: caption?.innerText || null,
        };
      }, buttonSelector);

      await browser.close();

      // Return data as JSON
      return {
        
        
          downloadLink: data.downloadLink || '',
          resolution: data.resolution || '',
          caption: data.caption || '',
        
      };
    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt >= retries) {
        // Return error details after exhausting retries
        return {
          
          
             downloadLink: '',
          resolution: '',
          caption: '',
          error: 'server error !!',
          
         
        };
      }

      console.log("Retrying...");
    }
  }
}

// Example usage
module.exports = {
  fbvideo,
}
// Example usage
