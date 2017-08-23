import Operations from '~/Operation';
import _ from 'lodash';

Operations.createOperation('HeatMap', ['matrix'], 'chart', async (data, options = {}) => {
    const matrix = data.matrix;
    const name = data.name || options.static_name || 'heatmap_plot';

    const trace = Object.assign({
        type: 'heatmap',
        z: matrix
    }, options);

    const layout = {
        title: 'Chart Title',
        yaxis: {
            ticks: ''
        },
        xaxis: {
            ticks: ''
        },
        margin: {
            l: 40, b: 40, r: 40, t: 40
        }
    };

    return {
        trace,
        layout,
        name
    };
});
