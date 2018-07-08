/**
 * Load data from NYC restaurant CSV (https://data.cityofnewyork.us/api/views/43nn-pn8j/rows.csv?accessType=DOWNLOAD)
 * Prevent duplicates from being inserted
 */

const csv = require('csv-parser');
const fs = require('fs');
const db = require('./db.js');
const config = require('./config.js');

/**
 * Inside of this main function, the
 * csv will be parsed by the csv module
 * Each line will be checked against the previous inserts
 * If the record is new, it will be inserted
 * Otherwise, if the grade date (report date) is newer that
 * the most recent update, the record will be updated.
 */

class CSVLoader {
    constructor() {
        this.db = db;
    }

    static load() {
        const items = {}; // build a temporary list of items to prevent importing duplicates
        fs.createReadStream(config.get('csv_location'))
            .pipe(csv())
            .on('data', (data) => {
                // as we stream data in, each row is a candidate for insert
                const res = {
                    camis: data.CAMIS,
                    name: data.DBA,
                    address: `${data.BUILDING} ${data.STREET}`,
                    postal_code: data.ZIPCODE,
                    phone: data.PHONE,
                    type: data['CUISINE DESCRIPTION'].toLowerCase(),
                    grade: data.GRADE ? config.get('grade')[data.GRADE] : 20,
                    date: new Date(data['GRADE DATE']),
                };
                // if we've already seen a CAMIS, update it if the grade date is more recent.
                if (res.camis in items) {
                    if (res.date > items[res.camis]) {
                        items[res.camis] = res.date;
                    }
                } else {
                    items[res.camis] = res.date;
                }
            });
    }
}

module.exports = new CSVLoader();
