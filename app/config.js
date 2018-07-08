/**
 * A central config to ensure there's a single source of truth for the config.
 */
require('dotenv').config();
const config = require('config');

module.exports = config;
