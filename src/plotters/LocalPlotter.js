import _ from 'lodash';
import Promise from 'bluebird';
import createPhantomPool from 'phantom-pool';
import URL2Image from 'image-data-uri';

const plotly = require.resolve('plotly.js/dist/plotly.min.js');
const d3 = require.resolve('d3/d3.min.js');

const phantomPool = createPhantomPool({
    max: 8,
    min: 2,
    maxUses: 200,
    autostart: false
});

const plot = async (trace, layout, options) => {
    const url = await phantomPool.use(async (instance) => {
        const page = await instance.createPage();
        await page.injectJs(d3);
        await page.injectJs(plotly);

        const outObj = instance.createOutObject();
        // outObj.data_url = '';
        page.property('onCallback', function (data, out) {
            if (data) out.data_url = data;
        }, outObj);

        await page.evaluate((trace, layout) => {
            const el = document.createElement('div');
            document.body.appendChild(el);

            return Plotly.plot(el, [trace], layout, { showLink: false })
                .then((gd) => Plotly.toImage(gd, { format: 'png', height: 800, width: 800 }))
                .then((url) => {
                    window.callPhantom(url);
                });
        }, trace, layout);

        await Promise.delay(5000)
        const url = await outObj.property('data_url');
        return url;
    });

    const file = `${options.path}/${options.name}.png`;
    URL2Image.outputFile(url, file);
    return file;
};

process.on('exit', () => {
    phantomPool.drain().then(() => pool.clear());
});


export default {
    plot
};
