import test from 'ava';

import Operations from 'Operation';
import 'LinePlots';

// Should be able to make a simple line plot with array data
test('LinePlot creates a simple line plot with array data and adds it to a data url', async t => {
    const data = {
        array: [1, 2, 3, 4, 5]
    };

    await Operations.LinePlot().execute(data);

    t.is(typeof data.chart[0].trace, 'object');
    t.is(typeof data.chart[0].layout, 'object');
    t.is(data.chart[0].name, 'line_plot');
});
