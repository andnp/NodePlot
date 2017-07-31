import _ from 'lodash';
import Promise from 'bluebird';
import phantom from 'phantom';
import URL2Image from 'image-data-uri';

const plot = async (trace, layout, name) => {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.injectJs(require.resolve('d3/d3.min.js'));
    await page.injectJs(require.resolve('plotly.js/dist/plotly.min.js'))

    const outObj = instance.createOutObject();
    outObj.data_url = '';
    page.property('onCallback', function (data, out) {
        out.data_url = data;
    }, outObj);

    await page.evaluate((trace, layout) => {
        const el = document.createElement('div');
        document.body.appendChild(el);

        Plotly.plot(el, [trace], layout, { showLink: false })
            .then((gd) => Plotly.toImage(gd, { format: 'png', height: 800, width: 800 }))
            .then((url) => {
                window.callPhantom(url);
            });
    }, trace, layout);

    const url = await outObj.property('data_url');
    await instance.exit();

    URL2Image.outputFile(url, `plots/${name}.png`);
};

export default {
    plot
};
