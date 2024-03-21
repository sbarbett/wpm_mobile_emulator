# wpm_mobile_emulator

To emulate the behavior of a mobile phone browser on WPM, we must modify the viewport using WebDriver and spoof the User-Agent header using the HttpClient as a proxy.

## WebDriver Options

The [base WebDriver object](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/remote/RemoteWebDriver.html) accesses the [WebDriver Options](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/WebDriver.Options.html) through the `manage` [method](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/remote/RemoteWebDriver.html#manage\(\)). Nested in the `options` is the [WebDriver Window](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/WebDriver.Window.html) class which is accessible through the `window` [method](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/WebDriver.Options.html#window\(\)).

```javascript
var driver = openBrowser();
var currentDimension = driver.manage().window().getSize();
log(currentDimension.toString())
```

You can retrieve the current browser viewport using the `getSize` [method](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/WebDriver.Window.html#getSize\(\)) as shown above. In order to set the viewport using the `setSize` [metod](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/WebDriver.Window.html#setSize\(org.openqa.selenium.Dimension\)), you must pass a [Dimension object](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/Dimension.html) as an argument.

```javascript
var newDimension = new org.openqa.selenium.Dimension(480, 800)
driver.manage().window().setSize(newDimension)
log(driver.manage().window().getSize().toString())
```

The Dimension class isn't mapped directly to an API on WPM's [public endpoints](http://docs.ultrawpm.com/testscript-api/biz/neustar/wpm/api/package-summary.html), but is accessible using the full package name, as demonstrated in the snippet.

## HttpClient Proxy

When using a real browser in WPM, the HttpClient can be used as a proxy to manipulate the HTTP request headers. This is accomplished using the `removeHeader` [method](http://docs.ultrawpm.com/testscript-api/biz/neustar/wpm/api/HttpClient.html#removeHeader\(java.lang.String\)) and `addHeader` [method](http://docs.ultrawpm.com/testscript-api/biz/neustar/wpm/api/HttpClient.html#addHeader\(java.lang.String,%20java.lang.String\)).

```javascript
var c = openHttpClient();
c.removeHeader('User-Agent');
c.addHeader('User-Agent', 'my-request-header/1.0');
```

_Note: You want to remove the existing User-Agent before adding a new one, otherwise it will send a request with two User-Agent headers. Most servers will ignore the second header, in this scenario._

## Module Usage

Upload `MobileEmulator.js` to [your data files](https://script.ultrawpm.com/#/files) in WPM.

1. Log in
2. Hover over "Scripting"
3. Click "Data Files"
4. Click "Upload A File"
5. Select your file

Once the file is uploaded, it can be invoked from your scripts using the `include` function. You must pass an instance of WebDriver and HttpClient as arguments.

```javascript
include('MobileEmulator');
var driver = openBrowser();
var c = openHttpClient();
var emulator = new MobileEmulator(driver, c);
```

### Templates

The module includes some templates of common phone dimensions and User-Agents. Selecting a template will automatically adjust the browser dimensions and User-Agent. You can view an array of valid template names using `getEmulationTemplate` and choose a template with `selectEmulationTemplate`.

```javascript
log(JSON.stringify(emulator.getEmulationTemplates())); // write to log buffer
emulator.selectEmulationTemplate("iPhone-13");
```

### Other Methods

The `getInfo` method will return the current height, width and User-Agent of the browser.

```javascript
log(JSON.stringify(emulator.getInfo()));
```

The `setHeight`, `setWidth`, and `setUserAgent` methods can be used to manually specify said properties.

```javascript
emulator.setWidth(600);
emulator.setHeight(800);
emulator.setUserAgent("my-request-header/1.0")
log(JSON.stringify(emulator.getInfo()))
```

## License

This project is licensed under the terms of the MIT license. See [LICENSE.md](LICENSE.md) for more details.