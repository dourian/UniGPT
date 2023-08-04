const crypto = require("crypto");
const fs = require("fs");
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
    await loadVisitedUrls();
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
    return;
  }
  visitedUrls.add(url);

  await driver.get(url);

  // Extract visible text from the page

  let pageText = "";
  try {
    pageText = await driver.executeScript(
      "return document.documentElement.innerText"
    );
  } catch (error) {
    console.log("Error occurred:", error);
  }

  // Generate a unique filename based on the URL
  const filename = generateUniqueFilename(url);

  // Save the page text to a text file with the unique filename
  fs.writeFileSync("../documents/" + filename, pageText);

  // Recursively find and click on other links
  const linkElements = await driver.findElements(By.css("a"));
  for (const linkElement of linkElements) {
    const linkHref = await linkElement.getAttribute("href");
    if (
      linkHref?.startsWith("https://uwaterloo.ca") &&
      !visitedUrls.has(linkHref) &&
      !linkHref.endsWith(".pdf")
    ) {
      await fs.appendFileSync("../documents/visited_urls.txt", linkHref + "\n");
      console.log(linkHref);
      await scrapePage(linkHref);
    }
  }
}

function generateUniqueFilename(url) {
  const hash = crypto.createHash("sha256").update(url).digest("hex");
  return `page_${hash}.txt`;
}

async function loadVisitedUrls() {
  try {
    const data = fs.readFileSync("../documents/visited_urls.txt", "utf8");
    const urls = data.split("\n");
    urls.forEach((url) => visitedUrls.add(url));
    console.log("Loaded visited URLs:", visitedUrls);
  } catch (error) {
    console.log("Error loading visited URLs:", error);
  }
}
