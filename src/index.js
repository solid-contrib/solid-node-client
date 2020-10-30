"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.setRestHandlers = exports.currentAuthFetcher = exports.currentSession = exports.logout = exports.login = exports.fetch = void 0;
var solid_auth_fetcher_1 = require("solid-auth-fetcher");
var node_fetch_1 = __importDefault(require("node-fetch"));
var solid_rest_1 = __importDefault(require("solid-rest"));
var rest = new solid_rest_1["default"]();
var DEBUG = false;
var authFetcher;
var globalSession;
function fetch(url, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, globalSession.fetch(url, options)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.fetch = fetch;
function login(options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options.idp = options.idp || process.env.SOLID_IDP;
                    options.username = options.username || process.env.SOLID_USERNAME;
                    options.password = options.password || process.env.SOLID_PASSWORD;
                    options.debug = options.debug || (process.env.SOLID_DEBUG) ? true : false;
                    options.rest = rest;
                    return [4 /*yield*/, _getAuthSession(options)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.login = login;
function logout() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!globalSession.loggedIn) return [3 /*break*/, 2];
                    return [4 /*yield*/, globalSession.logout()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    globalSession = new NodeNoAuthSession();
                    authFetcher = null;
                    return [2 /*return*/];
            }
        });
    });
}
exports.logout = logout;
function currentSession() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (globalSession.loggedIn) ? globalSession : null];
        });
    });
}
exports.currentSession = currentSession;
function currentAuthFetcher() {
    return authFetcher;
}
exports.currentAuthFetcher = currentAuthFetcher;
function setRestHandlers(handlers) {
    if (typeof handlers != "undefined") {
        rest = new solid_rest_1["default"](handlers);
    }
}
exports.setRestHandlers = setRestHandlers;
/** END OF PUBLIC METHODS
 */
/** AUTHENTICATED SESSION
 */
function _getAuthSession(options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            options.idp = options.idp || process.env.SOLID_IDP;
            options.username = options.username || process.env.SOLID_USERNAME;
            options.password = options.password || process.env.SOLID_PASSWORD;
            options.debug = options.debug || (process.env.SOLID_DEBUG) ? true : false;
            options.rest = rest;
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    _getAuthFetcher(options, function (session) {
                        resolve(session);
                    });
                })];
        });
    });
}
function _getAuthFetcher(options, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var cookie, session;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, solid_auth_fetcher_1.getNodeSolidServerCookie(options.idp, options.username, options.password)];
                case 1:
                    cookie = _a.sent();
                    return [4 /*yield*/, solid_auth_fetcher_1.getAuthFetcher(options.idp, cookie, "https://solid-node-client")];
                case 2:
                    authFetcher = _a.sent();
                    return [4 /*yield*/, solid_auth_fetcher_1.getSession()];
                case 3:
                    session = _a.sent();
                    authFetcher.onSession(function (s) { return __awaiter(_this, void 0, void 0, function () {
                        var originalFetch;
                        return __generator(this, function (_a) {
                            originalFetch = s.fetch;
                            s.fetch = function (url, opts) {
                                if (url.startsWith('http'))
                                    return originalFetch(url, opts);
                                return options.rest.fetch(url, opts);
                            };
                            globalSession = s;
                            callback(s);
                            return [2 /*return*/];
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
/** UNAUTHENTICATED SESSION
 */
var NodeNoAuthSession = /** @class */ (function () {
    function NodeNoAuthSession() {
        this.loggedIn = false;
    }
    NodeNoAuthSession.prototype.logout = function () { };
    NodeNoAuthSession.prototype.fetch = function (url, options) {
        if (url.startsWith('http'))
            return node_fetch_1["default"](url, options);
        return rest.fetch(url, options);
    };
    return NodeNoAuthSession;
}());
globalSession = new NodeNoAuthSession();
/* END */ 
