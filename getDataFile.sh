#!/usr/bin/env bash

mkdir data
wget -O ./data/data.csv https://data.cityofnewyork.us/api/views/43nn-pn8j/rows.csv?accessType=DOWNLOAD
echo 'Downloaded CSV'
exit
