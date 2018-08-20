/**
 * A central config to ensure there's a single source of truth for the config.
 */
require('dotenv').config('../');
// config values are loaded from the root config/.json files
const config = require('config');

class Config {
    constructor() {
        this.config = config;
    }

    get(name) {
        return this.config.get(name);
    }
}

module.exports = new Config();
