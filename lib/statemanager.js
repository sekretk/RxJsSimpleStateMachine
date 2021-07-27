"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateService = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var helpers_1 = require("./helpers");
var StateService = /** @class */ (function () {
    function StateService() {
        var _this = this;
        this.stateChangesObs = new rxjs_1.ReplaySubject();
        this.getFullStateObs = function () {
            var _a;
            return (_a = _this._fullStateObs) !== null && _a !== void 0 ? _a : (_this._fullStateObs =
                rxjs_1.concat(_this.initialStateObs().pipe(operators_1.first()), _this.stateChangesObs).pipe(operators_1.takeUntil(_this.destroyObs()), operators_1.finalize(function () { return delete _this._fullStateObs; }), helpers_1.accumulate({}), operators_1.tap(_this.sideEffect), operators_1.shareReplay(1)));
        };
        this.innerSubscribe = function () {
            var _a;
            return (_a = _this.stateSubscription) !== null && _a !== void 0 ? _a : (_this.stateSubscription = _this.getFullStateObs().pipe(operators_1.takeUntil(_this.destroyObs()), operators_1.finalize(function () { return delete _this.stateSubscription; })).subscribe());
        };
        this.stateObservable = function (request) {
            return _this.getFullStateObs().pipe(helpers_1.observableSelector(request));
        };
        this.save = function (key, value) {
            var _a;
            return _this.innerSubscribe() && _this.stateChangesObs.next((_a = {}, _a[key] = value, _a));
        };
    }
    return StateService;
}());
exports.StateService = StateService;
