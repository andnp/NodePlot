import test from 'ava';

import Operations from 'Operation';
import 'LinePlots';
import 'Plotters';

// Should be able to save a plot locally
test('SavePNG saves all charts to png', async t => {
    const data = {
        array: [1, 2, 3, 4, 5]
    };

    await Operations.LinePlot(data)
    .then(Operations.SavePNG);

    t.pass();
});
