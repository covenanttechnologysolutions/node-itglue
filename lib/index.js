"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Created by kgrube on 4/30/2019
 */

/**
 * @typedef {Object} ResponseError
 * @property config
 * @property message
 * @property request
 * @property response
 * @property response.config
 * @property response.data
 * @property {array<{ITGlueError}>} response.data.errors
 * @property response.headers
 * @property response.request
 * @property response.status
 * @property response.statusText
 *
 */

/**
 * @typedef {Object} ITGlueError
 * @property {Object} source
 * @property status
 * @property title
 *
 */
var axios = require('axios');

var GET = 'get';
var POST = 'post';
var PATCH = 'patch';
var DELETE = 'delete';
var BASE_URL = 'https://api.itglue.com';
var BASE_URL_EU = 'https://api.eu.itglue.com';
var BASE_URL_MOBILE = 'https://api-mobile-prod.itglue.com/api';
var MODE_BEARER = 'bearer';
var MODE_USER = 'user';
var MODE_APIKEY = 'apikey';
var MODE_USER_BEARER = 'user-bearer';
var MODES = [MODE_BEARER, MODE_USER, MODE_APIKEY, MODE_USER_BEARER];
/**
 *
 * @param config
 * @param [config.mode=apikey] ['apikey', 'bearer', 'user']
 * @param [config.apikey] specify to access API methods
 * @param [config.timeout=10000]
 * @param [config.eu=false]
 * @param [config.subdomain] specify to get a bearer token
 * @param [config.token] specify authentication using a bearer token
 * @param [config.user]
 * @param [config.user.email]
 * @param [config.user.password]
 * @param {String} [config.user.otp] one time password for MFA -- must be a string
 * @returns {Promise<{}>}
 * @constructor
 */

function ITGlue(_ref) {
  var apikey = _ref.apikey,
      _ref$mode = _ref.mode,
      mode = _ref$mode === void 0 ? MODE_APIKEY : _ref$mode,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 10000 : _ref$timeout,
      eu = _ref.eu,
      subdomain = _ref.subdomain,
      companyUrl = _ref.companyUrl,
      token = _ref.token,
      _ref$user = _ref.user;
  _ref$user = _ref$user === void 0 ? {} : _ref$user;
  var email = _ref$user.email,
      password = _ref$user.password,
      otp = _ref$user.otp;

  if (!MODES.includes(mode)) {
    throw new Error("mode ".concat(mode, " must be one of ['").concat(MODES.join('\',\''), "']"));
  }

  if (!subdomain && !companyUrl && (mode === MODE_USER || mode === MODE_USER_BEARER)) {
    throw new Error("subdomain must be defined in mode ".concat(MODE_USER));
  }

  if (!token && mode === MODE_BEARER) {
    throw new Error("token must be defined in mode ".concat(MODE_BEARER));
  }

  if (!apikey && mode === MODE_APIKEY) {
    throw new Error("apikey must be defined in mode ".concat(MODE_APIKEY));
  }

  this.apiBaseURL = BASE_URL;

  if (eu) {
    this.apiBaseURL = BASE_URL_EU;
  }

  this.config = {};
  this.mode = mode;
  this.token = token;
  this.user = {
    email: email,
    password: password,
    otp: otp
  };
  this.apikey = apikey;
  this.subdomain = subdomain;
  this.companyUrl = companyUrl;
  this.timeout = timeout;
  this.setAuthenticationMode(mode);
}
/**
 * @param path
 * @param [params]
 * @param [body]
 * @param method
 * @returns {Promise<{}>}
 * @throws {ResponseError}
 */


ITGlue.prototype.client = function (_ref2) {
  var _this = this;

  var path = _ref2.path,
      params = _ref2.params,
      body = _ref2.body,
      method = _ref2.method;
  return new Promise(function (resolve, reject) {
    return axios(path, _objectSpread({}, _this.config, {
      method: method,
      params: params,
      data: body
    })).then(function (res) {
      return resolve(res && res.data || res);
    }).catch(function (err) {
      return reject(err && err.response || err);
    });
  });
};

ITGlue.prototype.handler = function (options) {
  var _this2 = this;

  if (this.mode === MODE_APIKEY) {
    return this.client(options);
  }

  if (this.mode === MODE_USER && !this.token) {
    return this.getItGlueJsonWebToken(this.user).then(function (token) {
      _this2.token = token;

      _this2.setAuthenticationMode(MODE_BEARER);

      return _this2.client(options);
    });
  } else if (this.mode === MODE_USER && this.token) {
    this.setAuthenticationMode(MODE_BEARER);
    return this.client(options);
  } else if (this.mode === MODE_USER_BEARER && this.token) {
    this.setAuthenticationMode(MODE_USER_BEARER);
    return this.client(options);
  }

  if (this.mode === MODE_BEARER) {
    return this.client(options);
  }
};

ITGlue.prototype.get = function (_ref3) {
  var path = _ref3.path,
      params = _ref3.params;
  return this.handler({
    method: GET,
    path: path,
    params: params
  });
};

ITGlue.prototype.post = function (_ref4) {
  var path = _ref4.path,
      params = _ref4.params,
      body = _ref4.body;
  return this.handler({
    method: POST,
    path: path,
    params: params,
    body: body
  });
};

ITGlue.prototype.patch = function (_ref5) {
  var path = _ref5.path,
      params = _ref5.params,
      body = _ref5.body;
  return this.handler({
    method: PATCH,
    path: path,
    params: params,
    body: body
  });
};

ITGlue.prototype.delete = function (_ref6) {
  var path = _ref6.path,
      params = _ref6.params;
  return this.handler({
    method: DELETE,
    path: path,
    params: params
  });
};
/**
 *
 * @param [mode] ['apikey', 'bearer', 'user', 'user-bearer']
 */


ITGlue.prototype.setAuthenticationMode = function () {
  var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'apikey';
  this.mode = mode;
  var apikey = this.apikey,
      subdomain = this.subdomain,
      companyUrl = this.companyUrl,
      token = this.token,
      apiBaseURL = this.apiBaseURL;

  if (mode === MODE_USER) {
    if (companyUrl) {
      this.config.baseURL = companyUrl;
    } else {
      this.config.baseURL = "https://".concat(subdomain, ".itglue.com");
    }

    this.config.headers = {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    };
  } else if (mode === MODE_BEARER) {
    this.config.baseURL = BASE_URL_MOBILE;
    this.config.headers = {
      'cache-control': 'no-cache',
      'content-type': 'application/vnd.api+json',
      'authorization': "Bearer ".concat(token)
    };
  } else if (mode === MODE_USER_BEARER) {
    if (companyUrl) {
      this.config.baseURL = companyUrl;
    } else {
      this.config.baseURL = "https://".concat(subdomain, ".itglue.com");
    }

    this.config.headers = {
      'cache-control': 'no-cache',
      'content-type': 'application/vnd.api+json',
      'authorization': "Bearer ".concat(token)
    };
  } else {
    this.config.baseURL = apiBaseURL;
    this.config.headers = {
      'x-api-key': apikey,
      'cache-control': 'no-cache',
      'content-type': 'application/vnd.api+json'
    };
  }
};
/**
 * @param email
 * @param password
 * @param otp
 * @returns {Promise<{String}>} token
 */


ITGlue.prototype.getItGlueJsonWebToken = function (_ref7) {
  var _this3 = this;

  var email = _ref7.email,
      password = _ref7.password,
      otp = _ref7.otp;
  return this.client({
    method: POST,
    path: '/login',
    params: {
      generate_jwt: 1,
      sso_disabled: 1
    },
    body: {
      user: {
        email: email,
        password: password,
        otp_attempt: otp
      }
    }
  }).then(function (result) {
    return result.token;
  }).then(function (token) {
    return _this3.refreshItGlueJsonWebToken({
      token: token
    });
  }).then(function (token) {
    return token;
  });
};
/**
 * @param token
 * @returns {Promise<{String}>} token
 */


ITGlue.prototype.refreshItGlueJsonWebToken = function (_ref8) {
  var token = _ref8.token;
  return this.client({
    method: GET,
    path: '/jwt/token',
    params: {
      refresh_token: token
    }
  }).then(function (result) {
    return result.token;
  });
};
/**
 * @param query
 * @param related
 * @param limit
 * @param kind array-like string e.g. 'passwords,organizations'
 * @param filter_organization_id
 * @param sort specify value to sort on
 * @returns {Promise<Array<{}>>}
 */


ITGlue.prototype.search = function (_ref9) {
  var query = _ref9.query,
      _ref9$related = _ref9.related,
      related = _ref9$related === void 0 ? false : _ref9$related,
      _ref9$limit = _ref9.limit,
      limit = _ref9$limit === void 0 ? 50 : _ref9$limit,
      kind = _ref9.kind,
      filter_organization_id = _ref9.filter_organization_id,
      sort = _ref9.sort;

  if (this.mode !== MODE_USER_BEARER) {
    throw new Error("mode ".concat(MODE_USER_BEARER, " required for this method."));
  }

  return this.client({
    method: GET,
    path: '/search.json',
    params: {
      query: query,
      related: related,
      limit: limit,
      kind: kind,
      filter_organization_id: filter_organization_id,
      sort: sort
    }
  });
};
/**
 * @type {ITGlue}
 */


module.exports = ITGlue;