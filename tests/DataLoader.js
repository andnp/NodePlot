import test from 'ava';

import Operations from 'Operation';
import 'DataLoader';

const checkTestFile = (t, data) => {
    for (let i = 0; i < 2; ++i) {
        for (let j = 0; j < 4; ++j) {
            t.is(data.matrix[i][j], (i * 4) + j + 1);
        }
    }
};

// Should be able to load a file into a buffer
test('FileLoader creates an attribute "raw" and fills it with a buffer', async t => {
    const data = {}; // Initial object that will be mutated as it is passed through each operation
    data.location = 'test.csv'; // Initial object needs a filepath in the location field for the file loader to know where to load the data.
    await Operations.FileLoader().execute(data);
    t.true(data.raw instanceof Buffer);
});

// Should be able to read raw buffer into an array of arrays of strings
test('CSVReader reads "raw" and puts the arrays on "raw_set"', async t => {
    const data = {
        location: 'test.csv'
    };
    await Operations.FileLoader()
        .and(Operations.CSVReader)
        .execute(data);
    t.is(typeof data.matrix, 'object');
    t.true(data.matrix.length > 0);
});

// Should be able to specify each dependency in chain through promises
test(`Load file, parse csv, parse floats`, async t => {
    const data = {
        location: 'test.csv'
    };
    await Operations.FileLoader()
        .and(Operations.CSVReader)
        .execute(data)
        .then((data) => checkTestFile(t, data))
});

// Should be able to load a glob into an array of data objects. This must be the first operation in chain
test(`LoadGlob reads in all files in glob`, async t => {
    const data = {
        location: '*.js'
    };
    const files = await Operations.ReadGlob().execute(data);

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
    await Operations.WriteCSV('TEST_FILE.csv').execute(data);
    const result = {
        location: 'TEST_FILE.csv'
    };
    await Operations.FileLoader()
    .and(Operations.CSVReader)
    .execute(result);

    t.deepEqual(matrix, result.matrix);
});
