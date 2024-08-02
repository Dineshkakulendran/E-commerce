const { Builder, By, until } = require('selenium-webdriver');

// Function to introduce a delay
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

(async function test() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:3000');

    // Wait for a specific element that indicates the page is in Signup mode
    // Adjust the selector based on your actual page content
    const signupModeSelector = By.css('span'); // Update this selector
    let isSignupMode = false;
    try {
      await driver.wait(until.elementLocated(signupModeSelector), 5000); // Wait for the Signup indicator
      isSignupMode = true; // If found, set Signup mode
    } catch (error) {
      console.log('Signup mode not detected, defaulting to Login mode');
    }

    if (!isSignupMode) {
      // If not in Signup mode, switch to it
      // Update this selector to match the actual button or link that switches to Signup mode
      const switchToSignupButton = By.css('button#signup'); // Update this selector
      await driver.findElement(switchToSignupButton).click();
      await sleep(2000); // Wait for the page to update
    }

    // Fill in the Signup form
    await driver.wait(until.elementLocated(By.css('[name="username"]')), 10000);
    await driver.findElement(By.css('[name="username"]')).sendKeys('Signuptest');
    await sleep(2000);

    await driver.wait(until.elementLocated(By.css('[name="email"]')), 10000);
    await driver.findElement(By.css('[name="email"]')).sendKeys('signuptest@gmail.com');
    await sleep(2000);

    await driver.wait(until.elementLocated(By.css('[name="password"]')), 10000);
    await driver.findElement(By.css('[name="password"]')).sendKeys('1234');
    await sleep(2000);

    // Click the Signup button
    await driver.findElement(By.css('button[type="submit"]')).click();

    await sleep(5000); // Wait for the submission to complete

    // Check if redirected or some success message is displayed
    const url = await driver.getCurrentUrl();
    if (url === 'http://localhost:3000/') {
      console.log('Signup Test Passed');
    } else {
      console.error('Signup Test Failed: Unexpected URL or State');
    }
  } catch (error) {
    console.error('Signup Test Failed', error);
  } finally {
    await driver.quit();
  }
})();
