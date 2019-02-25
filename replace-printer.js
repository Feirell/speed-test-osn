const countChars = (char, string) => {
    let i = 0;
    for (let c of string)
        if (c == char)
            i++;

    return i;
}

const initialized = Symbol('initialized');
const running = Symbol('running');
const stopped = Symbol('stopped');

const states = [initialized, running, stopped];

class ReplacePrinter {

    constructor(waitTillFlush = 250, outstream = process.stdout) {
        if (!outstream.isTTY)
            throw new TypeError('the given outstream is not a tty');

        this._logStack = [];

        this._lastLineCount = 0;
        this._currentMessage = '';
        this._outstream = outstream;

        this._waitTimeTillFlush = waitTillFlush;
        this._timeoutid = null;

        this.state = initialized;
    }

    get state() {
        return this._state;
    }

    set state(newState) {
        if (states.indexOf(newState) == -1)
            throw new TypeError('the state ' + state + ' in none of the defined states');

        if (newState == this._state)
            return;

        if (newState == initialized && this._state != undefined)
            throw new Error('can not reset the state to initialized');

        if (newState == running && this._state != initialized)
            throw new Error('can not set the state to running when the current state is not initialized');

        if (newState == stopped && this._state != running)
            throw new Error('can not set the state to stopped when the current state is not running');

        if (newState == stopped)
            this._flushStack();

        this._state = newState;
    }

    console(methode, args) {
        if (!(methode in console))
            throw new TypeError('the methode "' + methode + '" is not given in console object (console.' + methode + ' does not exist)');

        this._logStack.push({
            methode,
            args
        });

        if (this.state != running)
            this._flushStack();
        else
            this._timeoutid = setTimeout(() => this._assembleOutput(), this._waitTimeTillFlush);

    }

    _clearFlushTimeout() {
        if (this._timeoutid !== null)
            clearTimeout(this._timeoutid);
    }

    log(...args) { this.console('log', args); }
    error(...args) { this.console('error', args); }
    info(...args) { this.console('info', args); }
    warn(...args) { this.console('warn', args); }

    _flushStack() {
        this._clearFlushTimeout();

        for (let { methode, args } of this._logStack)
            console[methode].apply(console, args);

        this._logStack = [];
    }

    replacingPrint(string) {
        this._currentMessage = string;

        this._assembleOutput();
    }

    _printing() {
        return this.state == running || this.state == initialized;
    }

    _assembleOutput() {
        if (!this._printing())
            throw new Error('this ReplacePrinter is in an invalid state to continue printing');

        this.state = running;

        this._outstream.moveCursor(-500, -this._lastLineCount);
        this._outstream.clearScreenDown()

        this._flushStack();

        this._outstream.write(this._currentMessage);
        this._lastLineCount = countChars('\n', this._currentMessage);
    }

    start() {
        this.state = running;
    }

    stop() {
        this.state = stopped;
    }
}

module.exports = ReplacePrinter;