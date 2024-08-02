const { Builder, By, until } = require('selenium-webdriver');

// Function to introduce a delay
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

(async function test() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:3000');

    // Wait for the email input to be present
    await driver.wait(until.elementLocated(By.css('[name="email"]')), 10000);
    await driver.findElement(By.css('[name="email"]')).sendKeys('signuptest@gmail.com');
    await sleep(2000);

    // Wait for the password input to be present
    await driver.wait(until.elementLocated(By.css('[name="password"]')), 10000);
    await driver.findElement(By.css('[name="password"]')).sendKeys('1234');
    await sleep(2000);

    await driver.findElement(By.css('button[type="submit"]')).click();

    await sleep(5000);

    console.log('Login Test Passed');
  } catch (error) {
    console.error('Login Test Failed', error);
  } finally {
    await driver.quit();
  }
})();


