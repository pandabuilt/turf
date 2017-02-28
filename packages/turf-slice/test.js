const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const mkdirp = require('mkdirp');
const featureCollection = require('@turf/helpers').featureCollection;
const slice = require('.');

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(folder => {
    return {
        folder,
        polygon: load.sync(path.join(directories.in, folder, 'polygon.geojson')),
        linestring: load.sync(path.join(directories.in, folder, 'linestring.geojson'))
    };
});

test('turf-slice', t => {
    for (const {folder, polygon, linestring} of fixtures) {
        console.log('processing:', folder);
        // Color Line
        linestring.properties['stroke'] = '#f0f';
        linestring.properties['stroke-width'] = 6;

        // Slice
        const sliced = slice(polygon, linestring);
        const debug = slice(polygon, linestring, true);

        // Save Results
        mkdirp.sync(path.join(directories.out, folder));
        if (process.env.REGEN) {
            write.sync(path.join(directories.out, folder, 'debug.geojson'), debug);
            write.sync(path.join(directories.out, folder, 'results.geojson'), sliced);
        }

        // Tests
        t.deepEquals(sliced, load.sync(path.join(directories.out, folder, 'results.geojson')), folder);
    }
    t.end();
});
