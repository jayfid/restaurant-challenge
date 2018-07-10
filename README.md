# NYC Restaurant Challenge

## Overview
This is a simple prototype that should accomplish the following requirements
- Import a list of NYC restaurant data into a database
- Query the database based on parameters
- Display the results in a webpage

## Technology Choices
NodeJS was chosen to get a working prototype done quickly.  NodeJS itself is performant enough to parse the number of records we have with no performance tuning.
Using NodeJS, an ETL module, API, and webpage can all be produced with minimal setup time.  I chose to use the csv, config, express, and mongo npm packages to handle the plumbing of parsing, configuring, serving, and storing resources.

MongoDB was chosen for the backend because of the ability to easily handle the number of records we're throwing at it as well as the ability to modify schema without install scripts or database updates.  For this project, we'll be writing to the db alot more than reading, but in a read world scenari the inverse would be true and mongo would be well suited.

I used jQuery to simplify frontend ajax activity.  I chose to use my person css library `vinylsiding` to speed up styling.

## API
The API consists of a single GET endpoint at `/restaurants`.  The get params _type_ and _grade_ are available to  limit the search.

## Installation
This app requires access to a mongodb instance.  See (their website)[https://www.mongodb.com/] for installation instructions.

To download the data used for this exercise, use can run `./getDataFile.sh` from the root directly, or follow (this link)[https://data.cityofnewyork.us/api/views/43nn-pn8j/rows.csv?accessType=DOWNLOAD].  When creating the env vars, set the SOURCE_FILE to the location of that file.

Create a `.env` file in the root directory.  The following variables are required
```
DB_NAME=myApp
DB_URL=mongodb://localhost:27017
COLLECTION_NAME=restaurants
SERVER_PORT=8080
SOURCE_FILE=./data/data.csv
LISTEN_PORT=8080
```

The app consists of an express AOU and a webpage.  After running `npm i`, launch them using these commands from the root directory:
```sh
# load csv data into mongodb
npm run load
```

```sh
# start API
npm run api
```

```sh
# start webpage
npm run web
```

## Schema
The overall schema is purposefully basic, storing data we need to query or display.
```javascript
{
    // track the source's unique identifier with the CAMIS value
    camis: data.CAMIS,
    name: data.DBA,
    // the address is the combination of the building number and street.  This could be extended to be more accurate, but is limited for prototyping purposes
    address: `${data.BUILDING} ${data.STREET}`,
    postal_code: data.ZIPCODE,
    phone: data.PHONE,
    type: data['CUISINE DESCRIPTION'].toLowerCase(),
    // the grade is stored as a numeric value to aid in database queries.
    // the numeric values are mapped to strings when importing or viewing data
    grade: data.GRADE ? GRADE_MAP[data.GRADE] : 20,
    date: new Date(data['GRADE DATE'])
}
```

### Possible schema extensions
Embed a list of "inspection events" in each restaurant document.  Could be helpful in charting patterns in grade changes.

## Limitations
During import, records are checked against their CAMIS id to spot duplicates.  This search time would increase as the number of records increase and de-duplication/disambiguation would be addressed in a much more distributed, failure tolerant manner.  Right now this is done in memory to speed things up.

The ETL import requires that a file stream and db connection remain open for it to continue.  This was done for time's sake and the coupling would be removed.

The _aesthetics_ of the app are as bare-bones as possible so time is spent focusing on coding.

_Geo-location_ could be achieved and used for lookups in the future, but this was bypassed to remove our dependencies on external APIs

_Hard-coded values_ in frontend js

_Proper validation_ would have been a rabbit hole in various parts of this

_Criteria_ for "best" restaurants is somewhat ambiguous

_Verbose error messages_.  Given more time, it would have made sense improve the fail states of the app.

_Paging_ api results was not included.
