"use strict";
/** UNAUTHENTICATED SESSION
 */
exports.__esModule = true;
exports.NoAuthSession = void 0;
var NoAuthSession = /** @class */ (function () {
    function NoAuthSession(options) {
        if (options === void 0) { options = {}; }
        this.fileHandler = options.fileHandler;
        this.httpFetch = options.httpFetch;
        this.createServerlessPod = this.fileHandler.createServerlessPod.bind(this.fileHandler);
        this.session = {
            isLoggedIn: false,
            info: { isLoggedIn: false },
            fetch: this._fetch.bind(this),
            logout: function () { }
        };
    }
    NoAuthSession.prototype._fetch = function (url, options) {
        if (url.startsWith('file'))
            return this.fileHandler.fetch(url, options);
        else
            return this.httpFetch(url, options);
    };
    return NoAuthSession;
}());
exports.NoAuthSession = NoAuthSession;
