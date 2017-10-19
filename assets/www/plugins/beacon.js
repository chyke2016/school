/*globals define, cordova, console, $ */

//
//  beacons.js
//
//  phonegap plugin
//  platforms: iOS(7.0+), Android 4.3+ (not completed yet)
//  devices: Apple iPhone 4s+, Android (almost all which supports Bluetooth LE)
//
//  Created by Roman Suranovsky on 23.06.14.
//
//  version 1.0.2  10 .07.14
//
//

define(function (require) {
    'use strict';
    
    /* params is a JSON object with following keys:
     * 
     * uuids:       array of proximity kit uuids (usually just one for a company)
     * messages:    JSON object with possible keys: notifTitle, notifText, menuTitle, menuText
     * settings:    JSON object of android specific settings for background scan with possible keys: scanPeriod (as long in milliseconds), scanInterval (as long in milliseconds) 
                    and a key: waitingNotificationTime (in seconds) for notifications of all platforms
                    
     * TODO: android need to define all beacons with uuid, maj, min values due the proximity kit creshs with wildcard of maj and min
     */
    var Beacon = function (params) {
        this.uuids = params.uuids;
        this.messages = params.messages;
        this.settings = params.settings;
    };

    Beacon.prototype.initData = function (callback) {
        cordova.exec(callback, function (err) {
            console.log("BeaconPlugin failed to initialize the data for iBeacons");
        }, "BeaconPlugin", "initData", [this.uuids, this.messages, this.settings]);
    };

    Beacon.prototype.start = function (callback) {
        cordova.exec(callback, function (err) {
            console.log("BeaconPlugin failed to start to scan for iBeacons");
        }, "BeaconPlugin", "start", []);
    };

    Beacon.prototype.showBranchMenu = function (data) {
        $('#beacons').show();
        this.updateTestData(data);
    };

    Beacon.prototype.hideBranchMenu = function () {
        $('#beacons').hide();
    };

    Beacon.prototype.updateTestData = function (data) {
        $('#beacons li#ibUuid').html("Ranged UUID: " + data.uuid);
        $('#beacons li#ibMajMin').html("Major: " + data.maj + ", Minor: " + data.min);
        $('#beacons li#ibValueForMajMin').html("Value: " + data.majminValue);
        $('#beacons li#ibRegion').html("Region: " + data.region);
        $('#beacons li#ibRegionID').html("RegionID: " + data.regionID);
        $('#beacons li#ibRSSI').html("RSSI: " + data.rssi);
        $('#beacons li#ibProximity').html("Proximity: " + data.proximity);
    };

    return Beacon;
});