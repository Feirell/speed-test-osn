const devPath = process.env.npm_package_config_osn_path || (() => {
    const fs = require('fs');
    const pj = JSON.parse(fs.readFileSync('./package.json'));
    if (!('config' in pj) || !('osn-path' in pj.config))
        throw new Error('working directory not found')

    return pj.config['osn-path'];
})()

const OpenSimplexNoiseDev = require(devPath).default;
// const FastSimplexNoise = require('fast-simplex-noise').default;
const OpenSimplexNoise = require('open-simplex-noise').default;

module.exports = function genSuites(Suite) {
    const suites = [];
    const seed = 662312;

    {
        const suite = new Suite("creation time");

        suite.add('open-simplex-noise', () => {
            new OpenSimplexNoise(seed);
        });

        // suite.add('fast-simplex-noise', () => {
        //     new FastSimplexNoise(seed);
        // });

        suite.add('open-simplex-noise-dev', () => {
            new OpenSimplexNoiseDev(seed);
        });

        // did not changed the constructor behavior
        // suites.push(suite);
    }

    const openSimplexNoise = new OpenSimplexNoise(seed);
    // const fastSimplexNoise = new FastSimplexNoise(seed);
    const openSimplexNoiseDev = new OpenSimplexNoiseDev(seed);

    const tests = [
        [0, 0],
        [1, 2],
        [3, 2],
        [0, 0, 0],
        [-323.212, 832.33, 0.3],
        [0, 3.141, 223.892, 0.453]
    ];

    for (let test of tests) {
        const opeName = 'noise' + test.length + 'D'
        console.log('%dD at (%s):\n  open: %d\n  dev:  %d',
            test.length,
            test.join(', '),
            openSimplexNoise[opeName](...test),
            openSimplexNoiseDev[opeName](...test))
    }

    let increment = 0;
    {
        const suite = new Suite("noise 2D at 2.5");

        suite.add('open-simplex-noise', () => {
            openSimplexNoise.noise2D(2.5, increment++);
        });

        // suite.add('fast-simplex-noise', () => {
        //     fastSimplexNoise.raw2D(2.5, increment++);
        // });

        suite.add('open-simplex-noise-dev', () => {
            openSimplexNoiseDev.noise2D(2.5, increment++);
        });

        suites.push(suite);
    }

    {
        const suite = new Suite("noise 3D at 2.5");

        suite.add('open-simplex-noise', () => {
            openSimplexNoise.noise3D(2.5, 2.5, increment++);
        });

        // suite.add('fast-simplex-noise', () => {
        //     fastSimplexNoise.raw3D(2.5, 2.5, increment++);
        // });

        suite.add('open-simplex-noise-dev', () => {
            openSimplexNoiseDev.noise3D(2.5, 2.5, increment++);
        });

        suites.push(suite);
    }

    {
        const suite = new Suite("noise 4D at 2.5");

        suite.add('open-simplex-noise', () => {
            openSimplexNoise.noise4D(2.5, 2.5, 2.5, increment++);
        });

        // suite.add('fast-simplex-noise', () => {
        //     fastSimplexNoise.raw4D(2.5, 2.5, 2.5, increment++);
        // });

        suite.add('open-simplex-noise-dev', () => {
            openSimplexNoiseDev.noise4D(2.5, 2.5, 2.5, increment++);
        });

        suites.push(suite);
    }

    return suites;
};