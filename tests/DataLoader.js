import test from 'ava';

import Operations from 'Operation';
import 'DataLoader';

const checkTestFile = (t, data) => {
    for (let i = 0; i < 2; ++i) {
        for (let j = 0; j < 4; ++j) {
            t.is(data.matrix[i][j], (i * 4) + j + 1);
        }
    }
    t.is(data.rows, 2);
    t.is(data.cols, 4);
};

// Should be able to load a file into a buffer
test('FileLoader creates an attribute "raw" and fills it with a buffer', async t => {
    const dataObject = {}; // Initial object that will be mutated as it is passed through each operation
    dataObject.location = 'test.csv'; // Initial object needs a filepath in the location field for the file loader to know where to load the data.
    await Operations.FileLoader(dataObject);
    t.true(dataObject.raw instanceof Buffer);
});

// Should be able to read raw buffer into an array of arrays of strings
test('CSVReader reads "raw" and puts the arrays on "raw_set"', async t => {
    const data = await Operations.FileLoader({
        location: 'test.csv'
    });
    // Check that file read step succeeded
    t.true(data.raw instanceof Buffer);

    await Operations.CSVReader(data);
    t.is(typeof data.raw_set, 'object');
    t.true(data.raw_set.length > 0);
});

test('NumericMatrix parses array of array of strings into floats from "raw_set" to "matrix"', async t => {
    const data = {};
    data.raw_set = [
        ['1', ' 2', '3 ', '4'],
        ['5', '6.0', '7', '8']
    ];

    await Operations.NumericMatrix(data);
    // Parsed data into matrix field
    t.is(typeof data.matrix, 'object');
    checkTestFile(t, data);
});

// Should be able to specify higher-level operations, then implicitly compute dependencies
test(`NumericMatrix loads file, parses csv, then parse floats`, async t => {
    await Operations.NumericMatrix({
        location: 'test.csv'
    }).then((data) => checkTestFile(t, data));
});

// Should be able to specify each dependency in chain through promises
test(`Load file, parse csv, parse floats`, async t => {
    await Operations.FileLoader({
        location: 'test.csv'
    })
        .then(Operations.CSVReader)
        .then(Operations.NumericMatrix)
        .then((data) => checkTestFile(t, data))
});

// Should be able to load a glob into an array of data objects. This must be the first operation in chain
test(`LoadGlob reads in all files in glob`, async t => {
    const files = await Operations.ReadGlob({
        location: '*.js'
    });

    files.map.map((data) => {
        t.true(data.location.length > 0)
    });

    t.true(files.map.length > 0);
});

// Should be able to write a matrix then read it back again.
test(`WriteCSV writes a matrix to a csv file`, async t => {
    const matrix = [
        [1, 2, 3],
        [4, 5, 6]
    ];

    const data = {matrix};
    await Operations.WriteCSV(data, 'TEST_FILE.csv');
    const result = {
        location: 'TEST_FILE.csv'
    };
    await Operations.FileLoader(result)
    .then(Operations.CSVReader)
    .then(Operations.NumericMatrix);

    t.deepEqual(matrix, result.matrix);
});
