"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var userstatemanager_1 = require("./userstatemanager");
var interfaces_1 = require("./interfaces");
var userStateObserver = new userstatemanager_1.UserStateService();
var startTime = Date.now();
var consoleHandler = function (prefix) { return function (value) { return console.log("At " + (Date.now() - startTime) + ": " + prefix + " " + JSON.stringify(value)); }; };
userStateObserver
    .stateObservable(interfaces_1.FULL_STATE)
    .subscribe(consoleHandler('Consumer, result FULL state: '));
userStateObserver.save('mode', 1);
userStateObserver.save('mode', 1);
userStateObserver.save('mode', 3);
rxjs_1.of(true).pipe(operators_1.delay(5000)).subscribe(function () { return userStateObserver.save('mode', 2); });
