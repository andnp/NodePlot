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
