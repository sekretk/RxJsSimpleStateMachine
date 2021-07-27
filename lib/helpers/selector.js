"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observableSelector = exports.partialExtractor = void 0;
var rxjs_1 = require("rxjs");
var _1 = require(".");
var interfaces_1 = require("../interfaces");
var lodash_es_1 = require("lodash-es");
/**
 * Extract from input object full\partial\only one prop
 * @param request Can be ALL, Array of properties, one property name, Works only with flat objects
 */
var partialExtractor = function (request) {
    return function (state) {
        return (request === interfaces_1.FULL_STATE
            ? state
            : Array.isArray(request)
                ? lodash_es_1.pick(state, request)
                : state[request]);
    };
};
exports.partialExtractor = partialExtractor;
/**
* provide only changed partial original state
* @param request Can be ALL, Array of properties, one property name
*/
var observableSelector = function (request) {
    return rxjs_1.pipe(rxjs_1.map(exports.partialExtractor(request)), rxjs_1.distinctUntilChanged(Array.isArray(request) ? lodash_es_1.isEqual : _1.referenceEqualer));
};
exports.observableSelector = observableSelector;
