"use strict";

exports.__esModule = true;
exports.NoAuthSession = void 0;

var NoAuthSession =
/** @class */
function () {
  function NoAuthSession(options) {
    if (options === void 0) {
      options = {};
    }

    var _a;

    this.fileHandler = options.fileHandler;
    this.httpFetch = options.httpFetch;
    this.createServerlessPod = (_a = this.fileHandler) === null || _a === void 0 ? void 0 : _a.createServerlessPod.bind(this.fileHandler);
    this.session = {
      isLoggedIn: false,
      info: {
        isLoggedIn: false
      },
      fetch: this._fetch.bind(this),
      logout: function () {}
    };
  }

  NoAuthSession.prototype._fetch = function (url, options) {
    if (url.startsWith('file')) return this.fileHandler.fetch(url, options);else return this.httpFetch(url, options);
  };

  return NoAuthSession;
}();

exports.NoAuthSession = NoAuthSession;