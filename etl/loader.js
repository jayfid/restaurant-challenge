'use strict';

/**
 * Load data from NYC restaurant CSV (https://data.cityofnewyork.us/api/views/43nn-pn8j/rows.csv?accessType=DOWNLOAD)
 * Prevent duplicates from being inserted
 */

require('dotenv').config();
const csv = require('csv-parser');
const mongo = require('mongodb').MongoClient;
const fs = require('fs');

const SOURCE_FILE = process.env.CSV_LOCATION;
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;
const GRADE_MAP = {
    'A': 1,
    'B': 2,
    'C': 3,
    'Z': 10,
    'P': 11,
    'Not Yet Graded': 12
}
/**
 * Inside of this main function, the client will be instantiated and the
 * csv will be parsed by the csv modules
 */
mongo.connect(DB_URL, (err, client) => {
    if (err) { throw err; }

    const db = client.db(DB_NAME);
    const items = {}; // build a temporary list of items to prevent importing duplicates
    
    fs.createReadStream(SOURCE_FILE)
    .pipe(csv())
    .on('data', (data) => {
        // as we stream data in, each row is a candiate for insert
        let res = {
            camis: data.CAMIS,
            name: data.DBA,
            address: `${data.BUILDING} ${data.STREET}`,
            postal_code: data.ZIPCODE,
            phone: data.PHONE,
            type: data['CUISINE DESCRIPTION'].toLowerCase(),
            grade: data.GRADE ? GRADE_MAP[data.GRADE] : 20,
            date: new Date(data['GRADE DATE'])
        };
        // if we've already seen a CAMIS, update it if the grade date is more recent.
        if (items.hasOwnProperty(res.camis)) {
            if (res.date > items[res.camis]) {
                db.collection(COLLECTION_NAME).update({id: res.camis}, res, (err) => {
                    if (err) { throw err; }
                });
                items[res.camis] = res.date;
            }
        } else {
            db.collection(COLLECTION_NAME).insertOne(res, (err) => {
                if (err) { throw err; }
            });
            items[res.camis] = res.date;
        }
    });
});