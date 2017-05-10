"use strict";


var slowdownWrapper = function (callback, delay) {
    var lastTs = 0;
    var wrapped = function (
        name, idx, currentTs, startTs, previousTs, previousPayload
    ) {
        if (currentTs - lastTs > delay) {
            callback(
                name, idx, currentTs, startTs, lastTs, previousPayload
            );
            lastTs = currentTs;
        }
    };
    return wrapped;
};

var Motion = function (name, callback) {
    this.running = false;
    this._wasRunning = false;
    this.currentTs = 0;
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
        this.currentTs = this.nowGetter();
        if (!this._wasRunning) {
            this._wasRunning = true;
            this.startTs = this.currentTs;
            this.previousTs = this.currentTs;
            this.idx = 0;
        }
        this.previousPayload = this.callback(
            this.name, this.idx,
            this.currentTs, this.startTs, this.previousTs,
            this.previousPayload
        );
        this.idx++;
        this.previousTs = this.currentTs;
    } else {
        if (this._wasRunning) {
            this._wasRunning = false;
        }
    }
};
