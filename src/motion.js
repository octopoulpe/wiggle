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


var lerper = function (initCb, stepCb, duration) {
    return function (name, delta, idx, nowTs, startTs, previous) {
        if (idx === 0) {
            var lerpCtx = initCb(name);
            if (!('from' in lerpCtx && 'to' in lerpCtx)) {
                console.error('lerper is missing infos !');
            }
            return lerpCtx;
        }
        var fullDelta = nowTs - startTs;
        if (fullDelta >= duration - 20) {
            // almost finished => say it is finished
            fullDelta = duration;
        }
        if (fullDelta <= duration) {
            var ipol = fullDelta / duration;
            var lerp = [];
            for (var i=0; i<previous.from.length; i++) {
                var from = previous.from[i];
                var to = previous.to[i];
                lerp.push(from + (to - from) * ipol);
            }
            var stepRes = stepCb(lerp);
            if (fullDelta === duration || !stepRes) {
                return null;
            }
            return previous;
        }
        return null;
    };
};


var ticker = function (tickables) {
    return function (nowTs) {
        tickables.forEach(function (tickable) {
            tickable.tick(nowTs);
        });
    };
};


var tillStop = function (trigger) {
    var active = false;
    return function (name, delta, idx, nowTs, startTs, previousPayload) {
        var trig = trigger(name, delta, idx, nowTs, startTs, previousPayload);
        if (trig && !active) {
            active = true;
            return true;
        }
        if (active && previousPayload) {
            active = true;
            return true;
        }
        active = false;
        return false;
    };
};


var Motion = function (name, callback, stateChecker, running) {
    this.running = running || false;
    this._wasRunning = false;
    this.startTs = 0;
    this.previousTs = 0;
    this.idx = 0;
    this.previousPayload = null;
    this.name = name;
    this.callback = callback;
    if (stateChecker) {
        // overload
        this.stateChecker = stateChecker;
    }
};

Motion.prototype.stateChecker = function () {
    return this.running;
};

Motion.prototype.nowGetter = function () {
    return performance.now();
};

Motion.prototype.tick = function (nowTs) {
    if (!nowTs) {
        nowTs = this.nowGetter();
    }

    if (!this._wasRunning) {
        this.previousPayload = null;
        this.startTs = nowTs;
        this.previousTs = nowTs;
        this.idx = 0;
    }
    var deltaT = nowTs - this.previousTs;

    var running = this.stateChecker(
        this.name, deltaT, this.idx,
        nowTs, this.startTs, this.previousPayload
    );

    if (running) {
        this._wasRunning = true;
        this.previousPayload = this.callback(
            this.name, deltaT, this.idx,
            nowTs, this.startTs, this.previousPayload
        );
        this.idx++;
        this.previousTs = nowTs;
    } else {
        this._wasRunning = false;
    }
};

module.exports = {
    slowdownWrapper: slowdownWrapper,
    Motion: Motion,
    ticker: ticker,
    lerper: lerper,
    tillStop: tillStop,
};
