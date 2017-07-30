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
