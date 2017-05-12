'use strict';

var slowdownWrapper = function (callback, delay) {
    var lastTs = 0;
    var slowedIdx = 0;
    var wrapped = function (
        name, idx, currentTs, startTs, previousTs, previousPayload
    ) {
        if (currentTs - lastTs > delay) {
            callback(
                name, slowedIdx, currentTs, startTs, lastTs, previousPayload
            );
            slowedIdx++;
            lastTs = currentTs;
        }
    };
    return wrapped;
};

var ticker = function (tickables) {
    return function () {
        tickables.forEach(function (tickable) {
            tickable.tick();
        });
    };
};

var Motion = function (name, callback) {
    this.running = false;
    this._wasRunning = false;
    this.startTs = 0;
    this.previousTs = 0;
    this.idx = 0;
    this.previousPayload = null;
    this.name = name;
    this.callback = callback;
};

Motion.prototype.stateChecker = function () {
    return this.running;
};

Motion.prototype.nowGetter = function () {
    return performance.now();
};

Motion.prototype.tick = function () {
    var running = this.stateChecker();
    if (running) {
        var currentTs = this.nowGetter();
        if (!this._wasRunning) {
            this._wasRunning = true;
            this.startTs = currentTs;
            this.previousTs = currentTs;
            this.idx = 0;
        }
        this.previousPayload = this.callback(
            this.name, this.idx,
            currentTs, this.startTs, this.previousTs,
            this.previousPayload
        );
        this.idx++;
        this.previousTs = currentTs;
    } else {
        if (this._wasRunning) {
            this._wasRunning = false;
        }
    }
};

module.exports = {
    slowdownWrapper: slowdownWrapper,
    Motion: Motion,
    ticker: ticker,
};
