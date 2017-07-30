import csv from 'csv';
import fs from 'fs';
import { promisify } from 'utils/PromiseUtil.js';

const readFilePromise = promisify.bind(null, fs.readFile);
const csvParse = promisify.bind(null, csv.parse);

readFilePromise('test.csv')
    .then(csvParse)
    .then((csv_string) => {
        console.log(csv_string)
    })
