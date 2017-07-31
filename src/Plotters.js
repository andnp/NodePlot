import Operations from 'Operation';
import LocalPlotter from 'plotters/LocalPlotter';

Operations.createOperation('SavePNG', ['chart'], '', async (data) => {
    const promises = data.chart.map((chart) => {
        return LocalPlotter.plot(chart.trace, chart.layout, chart.name);
    });

    await Promise.all(promises);
});
