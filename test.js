const path = require('path');
const benchmark = require('benchmark');
const bsf = require('benchmark-suite-formatter');

const ReplacePrinter = require('./replace-printer');

const { Suite } = benchmark;

const suiteCreateScript = path.resolve('.', process.argv[2] || 'test-suites-noise');
console.log('script for suite creation:', path.relative('.', suiteCreateScript));
const suites = require(suiteCreateScript)(Suite);

const rp = new ReplacePrinter();

let s, int;
const printSuites = (static = true) => {
    if (static)
        rp.replacingPrint('\n' + bsf.stringifySuite(s));
    else {
        rp.log('\n' + bsf.stringifySuite(s));
        rp.replacingPrint('');
    }
}

const nextSuite = () => {
    s = suites.shift();

    if (!s) {
        if (int)
            clearInterval(int);
        return;
    }

    if (!int)
        int = setInterval(printSuites, 1000 / 24);

    s.on('complete', () => {
        printSuites(false);
        nextSuite();
    });

    s.run({ 'async': true });
}

nextSuite();
