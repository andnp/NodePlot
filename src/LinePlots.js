import Operations from '~/Operation';
import _ from 'lodash';

Operations.createOperation('LinePlot', ['array'], 'chart', async (data, name = 'line_plot') => {
    const array = data.array;

    const trace = {
        type: 'scatter',                    // set the chart type
        mode: 'lines',                      // connect points with lines
        x: _.times(array.length, (i) => i),
        y: array,
        line: {                             // set the width of the line.
            width: 1
        }
    };

    const layout = {
        yaxis: { title: "Chart Title!!" },       // set the y axis title
        xaxis: {
            showgrid: false                  // remove the x-axis grid lines
        },
        margin: {                           // update the left, bottom, right, top margin
            l: 40, b: 40, r: 40, t: 40
        }
    };

    return {
        trace,
        layout,
        name
    };
});
