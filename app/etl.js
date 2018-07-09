/**
 * Load data from NYC restaurant CSV (https://data.cityofnewyork.us/api/views/43nn-pn8j/rows.csv?accessType=DOWNLOAD)
 * Prevent duplicates from being inserted.  Inspection information can
 * be added later by correlating camis values.
 */

const csv = require('csv-parser');
const fs = require('fs');
const config = require('./config.js');
const db = require('./db.js');


/**
 * Inside of this main function, the
 * csv will be parsed by the csv module
 * Each line will be checked against the previous inserts
 * If the record is new, it will be inserted
 * Otherwise, if the grade date (report date) is newer that
 * the most recent update, the record will be updated.
 */

class Etl {
    constructor() {
        this.db = db;
        this.db.getDB();
        /* eslint-disable no-console */
        console.log(db);
        /* eslint-enable no-console */


        process.exit();
    }

    static load() {
        const items = {}; // build a temporary list of items to prevent importing duplicates
        fs.createReadStream(config.get('env.source_file'))
            .pipe(csv())
            .on('data', (data) => {
                // as we stream data in, each row is a candidate for insert
                const record = {
                    camis: data.CAMIS,
                    name: data.DBA,
                    address: `${data.BUILDING} ${data.STREET}`,
                    boro: data.BORO,
                    postal_code: data.ZIPCODE,
                    phone: data.PHONE,
                    score: data.score,
                    type: data['CUISINE DESCRIPTION'].toLowerCase(),
                    grade: data.GRADE ? config.get('grades')[data.GRADE] : 20,
                    grade_date: new Date(data['GRADE DATE']),
                    record_date: new Date(data['RECORD DATE']),
                };
                // if we've already seen a CAMIS, update it if the grade date is more recent.
                if (record.camis in items) {
                    if (record.record_date > items[record.camis]) {
                        this.db.update(record);
                        items[record.camis] = record.record_date;
                    }
                } else {
                    this.db.insertOne(record);
                    items[record.camis] = record.record_date;
                }
            })
            .on('finish', () => {
                process.exit();
            });
    }
}

module.exports = Etl;
