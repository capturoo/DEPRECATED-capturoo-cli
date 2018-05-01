'use strict';
const axios = require('axios');
const config = require('./config');
const axiosConfig = {
  baseURL: (process.env.CAPTUROO_CLI_DEBUG_MODE) ? config.debugApiEndpoint : config.apiEndpoint,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json'
  }
};
const instance = axios.create(axiosConfig);

module.exports = instance;
