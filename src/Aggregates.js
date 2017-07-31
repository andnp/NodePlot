import Operations from 'Operation';
import MatDash from 'utils/MatrixUtils';

Operations.createOperation('HorizontalAverage', ['matrix', 'rows', 'cols'], 'horizontal_averages', (data) => {
    const { matrix, rows, cols } = data;
    const rowVals = MatDash.makeArray(rows);
    MatDash.forEach(matrix, (m, i) => {
        rowVals[i] += m;
    });

    const avgs = rowVals.map((row) => row/cols);
    return avgs;
});

Operations.createOperation('VerticalAverage', ['matrix', 'rows', 'cols'], 'vertical_averages', (data) => {
    const { matrix, rows, cols } = data;
    const colVals = MatDash.makeArray(cols);
    MatDash.forEach(matrix, (m, i_, j) => {
        colVals[j] += m;
    });

    const avgs = colVals.map((col) => col/rows);
    return avgs;
});

Operations.createOperation('HorizontalAverageToArray', ['horizontal_averages'], 'array', (data) => {
    return data.horizontal_averages;
});

Operations.createOperation('VerticalAverageToArray', ['vertical_averages'], 'array', (data) => {
    return data.vertical_averages;
});
