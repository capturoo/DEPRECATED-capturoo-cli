'use strict';
const axios = require('axios');
const config = require('./config');
const contextConfig = (process.env.CAPTUROO_CLI_DEBUG_MODE) ? config.staging : config.production;
const axiosConfig = {
  baseURL: contextConfig.apiEndpoint,
  timeout: contextConfig.apiTimeout,
  headers: {
    'Content-Type': 'application/json'
  }
};
const instance = axios.create(axiosConfig);

module.exports = instance;
