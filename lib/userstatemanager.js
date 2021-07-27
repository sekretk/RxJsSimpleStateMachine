"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStateService = void 0;
var rxjs_1 = require("rxjs");
var statemanager_1 = require("./statemanager");
var DEFAULT_USER_STATE = {
    user: 'John Do',
    theme: 'light',
    mode: 1
};
var UserStateService = /** @class */ (function (_super) {
    __extends(UserStateService, _super);
    function UserStateService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._destroyObs = new rxjs_1.Subject();
        _this.initialStateObs = function () { return rxjs_1.of(DEFAULT_USER_STATE); };
        _this.destroyObs = function () { return _this._destroyObs.asObservable(); };
        _this.sideEffect = function (state) { return console.log('[UserStateService#sideEffect]', state); };
        _this.stop = function () { return _this._destroyObs.next(true); };
        return _this;
    }
    return UserStateService;
}(statemanager_1.StateService));
exports.UserStateService = UserStateService;
