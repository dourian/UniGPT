const fs = require("fs");
const crypto = require("crypto");
const webdriver = require("selenium-webdriver"),
  By = webdriver.By,
  until = webdriver.until;

const driver = new webdriver.Builder().forBrowser("chrome").build();
const visitedUrls = new Set();

main();

/**
 * Main function.
 */
async function main() {
  try {
    await scrapePage("https://uwaterloo.ca/"); // Replace with the starting URL
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    driver.quit();
  }
  testSelenium();
}

async function testSelenium() {
  driver.get("http://www.google.com").then(function () {
    driver
      .findElement(webdriver.By.name("q"))
      .sendKeys("webdriver\n")
      .then(function () {
        driver.getTitle().then(function (title) {
          console.log(title);
          if (title === "webdriver - Google Search") {
            console.log("Test passed");
          } else {
            console.log("Test failed");
          }
          driver.quit();
        });
      });
  });
}

/**
 * TODO: get this to actually work XD
 * @param {string} url
 */
async function scrapePage(url) {
  if (visitedUrls.has(url)) {
    return; // Avoid revisiting the same URL
  }

  visitedUrls.add(url);

  await driver.get(url);

  // Extract visible text from the page
  const pageText = await driver.executeScript(
    "return document.documentElement.innerText"
  );

  // Generate a unique filename based on the URL
  const filename = generateUniqueFilename(url);

  // Save the page text to a text file with the unique filename
  fs.writeFileSync("../documents/"+filename, pageText);

  // Recursively find and click on other links
  const linkElements = await driver.findElements(By.css("a"));
  for (const linkElement of linkElements) {
    const linkHref = await linkElement.getAttribute("href");
    if (linkHref?.startsWith("http")) {
      await scrapePage(linkHref);
    }
  }
}

function generateUniqueFilename(url) {
  const hash = crypto.createHash("sha256").update(url).digest("hex");
  return `page_${hash}.txt`;
}
