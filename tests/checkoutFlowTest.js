const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function testCheckoutFlow() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // 1. Navigate to Homepage
    console.log('Navigating to homepage...');
    await driver.get('http://localhost:3000/');
    await driver.wait(until.elementLocated(By.css('.shop-category')), 20000);
    await driver.sleep(2000);
    console.log('Homepage loaded.');

    // 2. View Product Details
    console.log('Viewing product details...');
    let productElement = await driver.findElement(By.css('.shopcategory-products .item'));
    await productElement.click();
    await driver.wait(until.elementLocated(By.css('.productdisplay')), 20000);
    await driver.sleep(2000);
    console.log('Product details viewed.');

    // 3. Add Product to Cart
    console.log('Adding product to cart...');
    let addToCartButton = await driver.findElement(By.css('.button'));
    await driver.wait(until.elementIsVisible(addToCartButton), 20000);
    await addToCartButton.click();
    console.log('Product added to cart.');

    // Adding a wait to ensure the product is added to the cart
    await driver.sleep(5000); // Increase wait time if needed

    // 4. View Cart Items
    console.log('Viewing cart items...');
    await driver.get('http://localhost:3000/cart');
    await driver.wait(until.elementLocated(By.css('.cartitems')), 20000);
    await driver.sleep(2000);

    // Verify cart items
    console.log('Verifying cart items...');
    let cartItems = await driver.findElements(By.css('.cartitems-format-main .name'));

    // Log the number of cart items found
    console.log('Number of items in cart:', cartItems.length);

    assert(cartItems.length > 0, 'Cart should have items');

    // Verify the specific product added
    let productInCart = await driver.findElement(By.css('.cartitems-format-main .name')).getText();
    assert(productInCart, 'Expected product name');
    console.log('Cart items verified: ' + productInCart);

    // 5. Complete Purchase (Optional)
    // Simulate entering shipping/payment details and submitting the form
    console.log('Test completed successfully.');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await driver.quit();
  }
})();
