// Include the content of MobileEmulator.js
include('MobileEmulator');
// Instantiate a web browser
var driver = openBrowser();
// Instantiate an HttpClient object
var c = openHttpClient();

// Instantiate a MobileEmulator object
var emulator = new MobileEmulator(driver, c);
// Output current settings to log buffer
log("Default browser settings: " + JSON.stringify(emulator.getInfo()))
// Output template names to log buffer
log("Valid mobile emulation templates: " + JSON.stringify(emulator.getEmulationTemplates()))
// Change the emulation template to an iPhone 13
emulator.selectEmulationTemplate("iPhone-13");
// Output new settings to log buffer
log(JSON.stringify(emulator.getInfo()))

// If you want to simulate a slower network speed, you can throttle the bandwidth
setBandwidthLimitMode("on");
// 8Mbps download
setDownstreamKbps(8000);
// 2.5Mbps upload
setUpstreamKbps(2500);
// Add a 50ms latency
setLatency(50);

// Start recording your transaction
beginTransaction(function(tx) {
    
    // Step 1 - Step name, timeout, callback function
    beginStep("Load google.com", 15000, function(step) {
        // Load google.com in the web browser
        driver.get('https://www.google.com');
    });

});