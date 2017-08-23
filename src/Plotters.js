import Operations from '~/Operation';
import LocalPlotter from '~/plotters/LocalPlotter';

Operations.createOperation('SavePNG', ['chart'], 'pngs', async (data, options) => {
    const promises = data.chart.map((chart) => {
        return LocalPlotter.plot(chart.trace, chart.layout, {name: chart.name, path: options.path});
    });

    await Promise.all(promises);
});
