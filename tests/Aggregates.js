import test from 'ava';

import Operations from 'Operation';
import 'Aggregates';

// Should be able to compute the average of each row in a matrix
test('HorizontalAverage takes "matrix, rows, cols" and creates "horizontal_averages"', async t => {
    const data = {
        matrix: [
            [1, 2, 3],
            [2, 3, 4],
            [1, 3, 5],
            [1, 4, 7]
        ],
        rows: 4,
        cols: 3
    };

    await Operations.HorizontalAverage(data);

    t.deepEqual(data.horizontal_averages, [2, 3, 3, 4]);
});

// Should be able to compute the average of each col in a matrix
test('VerticalAverage takes "matrix, rows, cols" and creates "vertical_averages"', async t => {
    const data = {
        matrix: [
            [1, 2, 3],
            [2, 3, 4],
            [3, 4, 5],
            [4, 5, 6],
            [5, 6, 7]
        ],
        rows: 5,
        cols: 3
    };

    await Operations.VerticalAverage(data);

    t.deepEqual(data.vertical_averages, [3, 4, 5]);
});
