function MobileEmulator(driver, client) {
    /*
     *  This module is written for Vercara's Web Performance Management product (UltraWPM). The WPM
     *  agent runs in a Linux (Ubuntu) environment and uses X11 displays for real-browser (Selenium)
     *  test cases. While no functionality has been implemented for running test cases in real mobile
     *  OS environments (Android, iOS), it is possible to emulate the behavior of a mobile browser
     *  by adjusting the viewport and User-Agent header to that of a phone's. In this module we've
     *  created methods for handling this, using WebDriver's Dimension and Options classes and the
     *. HttpClient as a proxy.
     */
    this.driver = driver;
    this.client = client;
    this.width = this.driver.manage().window().getSize().width;
    this.height = this.driver.manage().window().getSize().height;
    this.userAgent = this.driver.executeScript("return navigator.userAgent") + "";

    // Some common dimensions and user-agents for various models of phones.
    var dimensionMap = {
        'iPhone-13': { 
            width: 1170, 
            height: 2532, 
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' 
        },
        'iPhone-13-Pro-Max': { 
            width: 1284, 
            height: 2778, 
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' 
        },
        'iPhone-XS': { 
            width: 1125, 
            height: 2436, 
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' 
        },
        'iPhone-8': { 
            width: 750, 
            height: 1334, 
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' 
        },
        'Samsung-Galaxy-S21': { 
            width: 1080, 
            height: 2400, 
            userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Mobile Safari/537.36' 
        },
        'Samsung-Galaxy-S22': { 
            width: 1080, 
            height: 2340, 
            userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.101 Mobile Safari/537.36' 
        },
        'Samsung-Galaxy-S9': { 
            width: 1440, 
            height: 2960, 
            userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.3' 
        },
        'Google-Pixel-6': { 
            width: 1080, 
            height: 2400, 
            userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6 Build/SP1A.210812.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Mobile Safari/537.36' 
        },
        'Google-Pixel-3': { 
            width: 1080, 
            height: 2160, 
            userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 3 Build/RP1A.200720.009) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.3' 
        },
        // Add more templates as needed
    };

    // Return an array of valid templates
    this.getEmulationTemplates = function() {
        var templates = [];
        for (var template in dimensionMap) {
            if (dimensionMap.hasOwnProperty(template)) {
                templates.push(template);
            }
        }
        return templates;
    };

    // Select one of the templates from the dimensionMap. This will automatically set the dimensions and user-agent.
    this.selectEmulationTemplate = function(template) {
        if(dimensionMap[template]) {
            var dims = dimensionMap[template];
            this.setWidth(dims.width);
            this.setHeight(dims.height);
            this.setUserAgent(dims.userAgent);
        } else {
            throw new Error('Template ' + template + ' not found');
        }
    };

    // Set the width of the browser manually
    this.setWidth = function(width) {
        this.width = width;
        var currentDimension = this.driver.manage().window().getSize();
        var newDimension = new org.openqa.selenium.Dimension(width, currentDimension.height);
        this.driver.manage().window().setSize(newDimension);
    };

    // Set the height of the browser manually
    this.setHeight = function(height) {
        this.height = height;
        var currentDimension = this.driver.manage().window().getSize();
        var newDimension = new org.openqa.selenium.Dimension(currentDimension.width, height);
        this.driver.manage().window().setSize(newDimension);
    };

    // Set the User-Agent header manually
    this.setUserAgent = function(userAgent) {
        this.userAgent = userAgent;
        this.client.removeHeader('User-Agent');
        this.client.addHeader('User-Agent', userAgent);
    };

    // Returns the current browser dimensions and User-Agent
    this.getInfo = function() {
        var currentDimension = this.driver.manage().window().getSize();
        this.width = currentDimension.width;
        this.height = currentDimension.height;
        return {
            width: this.width,
            height: this.height,
            'user-agent': this.userAgent
        };
    };
}