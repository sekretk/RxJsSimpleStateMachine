"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accumulate = exports.mergeToObject = exports.non = exports.referenceEqualerCurried = exports.referenceEqualer = void 0;
var rxjs_1 = require("rxjs");
var referenceEqualer = function (first, second) { return first === second; };
exports.referenceEqualer = referenceEqualer;
var referenceEqualerCurried = function (first) { return function (second) { return exports.referenceEqualer(first, second); }; };
exports.referenceEqualerCurried = referenceEqualerCurried;
var non = function (fun) { return function () {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    return !fun.apply(void 0, params);
}; };
exports.non = non;
var mergeToObject = function (accumulator, increment) { return (__assign(__assign({}, accumulator), increment)); };
exports.mergeToObject = mergeToObject;
/**
 * accumulate partial on state to full object
 * @param defaultValue DEFAULT VALUE to start with
 */
var accumulate = function (defaultValue) {
    return rxjs_1.scan(exports.mergeToObject, defaultValue);
};
exports.accumulate = accumulate;
