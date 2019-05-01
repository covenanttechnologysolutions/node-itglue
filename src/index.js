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

const axios = require('axios');

const GET = 'get';
const POST = 'post';
const PATCH = 'patch';
const DELETE = 'delete';

const BASE_URL = 'https://api.itglue.com';
const BASE_URL_EU = 'https://api.eu.itglue.com';

/**
 *
 * @param config
 * @param config.apikey
 * @param [config.timeout=10000]
 * @param [config.eu=false]
 * @returns {Promise<{}>}
 * @constructor
 */
function ITGlue({apikey, timeout, eu}) {
  if (!timeout) {
    timeout = 10000;
  }
  let baseURL = BASE_URL;
  if (eu) {
    baseURL = BASE_URL_EU;
  }

  this.config = {
    baseURL,
    headers: {
      'x-api-key': apikey,
    },
  };
}

/**
 * @param path
 * @param [params]
 * @param [body]
 * @param method
 * @returns {Promise<{}>}
 * @throws {ResponseError}
 */
ITGlue.prototype.client = function ({path, params, body, method}) {
  return new Promise((resolve, reject) => {
    return axios(path, {...this.config, method, params, data: body, url: path})
      .then(res => {
        return resolve(res);
      })
      .catch(err => {
        let data = {};

        if (err && err.response && err.response.data) {
          data = err.response.data;
        }

        if (data.errors) {
          return reject(data.errors);
        } else if (err.message) {
          return reject(err.message);
        }
      });
  });
};

ITGlue.prototype.get = function ({path, params}) {
  return this.client({method: GET, path, params});
};

ITGlue.prototype.post = function ({path, params, body}) {
  return this.client({method: POST, path, params, body});
};

ITGlue.prototype.patch = function ({path, params, body}) {
  return this.client({method: PATCH, path, params, body});
};

ITGlue.prototype.delete = function ({path, params}) {
  return this.client({method: DELETE, path, params});
};


/**
 * @type {ITGlue}
 */
module.exports = ITGlue;
