"use strict";

var __createBinding = void 0 && (void 0).__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = void 0 && (void 0).__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SolidNodeClient = void 0;
var NoAuthSession_1 = require("./NoAuthSession");
//
// TBD rename NssAuth -> UserAuth; EssAuth -> TokenAuth
//
var NssAuthSession_1 = require("./NssAuthSession");
var EssAuthSession_1 = require("./EssAuthSession");
var file_1 = require("@solid-rest/file");
var node_fetch_1 = __importDefault(require("node-fetch"));
var UrlObj = __importStar(require("url"));
var SolidNodeClient = /** @class */function () {
  function SolidNodeClient(options) {
    if (options === void 0) {
      options = {};
    }
    options.handlers = options.handlers || {};
    options.handlers.http = options.handlers.http || node_fetch_1.default;
    options.handlers.file = options.handlers.file || new NoAuthSession_1.NoAuthSession({
      httpFetch: options.handlers.http,
      fileHandler: new file_1.SolidRestFile()
    });
    options.appUrl = options.appUrl || "https://solid-node-client";
    if (options.handlers.https) this.handlers.userHttps = options.handlers.https;
    this.appUrl = options.appUrl;
    this.handlers = options.handlers;
    this.debug = false;
    return this;
  }
  SolidNodeClient.prototype.fetch = function (url, options) {
    return __awaiter(this, void 0, void 0, function () {
      var protocol, _fetch;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            protocol = new UrlObj.URL(url).protocol.replace(/:$/, '');
            _fetch = this.handlers[protocol] && this.handlers[protocol].session ? this.handlers[protocol].session.fetch : this.handlers.file.session.fetch;
            return [4 /*yield*/, _fetch(url.toString(), options)];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  SolidNodeClient.prototype.login = function () {
    return __awaiter(this, arguments, void 0, function (credentials, protocol) {
      var session, _a;
      if (credentials === void 0) {
        credentials = {};
      }
      if (protocol === void 0) {
        protocol = "https";
      }
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (!Object.keys(credentials).length) {
              credentials.idp = process.env.SOLID_IDP;
              credentials.username = process.env.SOLID_USERNAME;
              credentials.password = process.env.SOLID_PASSWORD;
            }
            if (this.handlers.userHttps) {
              this.handlers.https = this.handlers.userHttps;
            } else if (credentials.username && credentials.password && credentials.idp) {
              this.handlers.https = new NssAuthSession_1.NssAuthSession();
            } else {
              this.handlers.https = new EssAuthSession_1.EssAuthSession();
            }
            if (!this.handlers[protocol]) return [3 /*break*/, 2];
            return [4 /*yield*/, this.handlers[protocol].login(credentials, this.appUrl)];
          case 1:
            _a = _b.sent();
            return [3 /*break*/, 3];
          case 2:
            _a = this.handlers.file.session;
            _b.label = 3;
          case 3:
            session = _a;
            session || (session = this.handlers.file.session);
            return [2 /*return*/, session];
        }
      });
    });
  };
  SolidNodeClient.prototype.getSession = function () {
    return __awaiter(this, arguments, void 0, function (protocol) {
      var session;
      if (protocol === void 0) {
        protocol = "https";
      }
      return __generator(this, function (_a) {
        session = this.handlers[protocol] && this.handlers[protocol].session ? this.handlers[protocol].session : this.handlers.file.session;
        return [2 /*return*/, session];
      });
    });
  };
  SolidNodeClient.prototype.logout = function () {
    return __awaiter(this, arguments, void 0, function (protocol) {
      var session;
      if (protocol === void 0) {
        protocol = "https";
      }
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.getSession(protocol)];
          case 1:
            session = _a.sent();
            if (!session.info.isLoggedIn) return [3 /*break*/, 3];
            return [4 /*yield*/, session.logout()];
          case 2:
            _a.sent();
            _a.label = 3;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  SolidNodeClient.prototype.createServerlessPod = function (base) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.handlers.file.createServerlessPod(base)];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  return SolidNodeClient;
}();
exports.SolidNodeClient = SolidNodeClient;