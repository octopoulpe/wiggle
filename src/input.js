'use strict';

var ctx = require('./context').ctx;


var KeyboardState = function () {
    this.keystates = {};
    this.boundKeyup = this.keyup.bind(this);
    this.boundKeydown = this.keydown.bind(this);
};

KeyboardState.prototype.keyup = function (event) {
    this.keystates[event.code] = true;
};

KeyboardState.prototype.keydown = function (event) {
    if (this.keystates[event.code]) {
        this.keystates[event.code] = false;
    }
};

KeyboardState.prototype.keyChecker = function (code) {
    return this.isPressed.bind(this, code);
};

KeyboardState.prototype.eventKeyChecker = function (code) {
    var hasBeenPressed = false;
    return function (code) {
        if (this.isPressed(code)) {
            if (!hasBeenPressed) {
                hasBeenPressed = true;
                return true;
            }
        } else {
            hasBeenPressed = false;
        }
        return false;
    }.bind(this, code);
};

KeyboardState.prototype.releaseKeyChecker = function (code) {
    var hasBeenPressed = false;
    return function (code) {
        if (this.isPressed(code)) {
            hasBeenPressed = true;
            return false;
        } else {
            if (hasBeenPressed) {
                hasBeenPressed = false;
                return true;
            }
        }
        return false;
    }.bind(this, code);
};

KeyboardState.prototype.isPressed = function (code) {
    if (this.keystates[code]) {
        if (!ctx().focused) {
            this.keystates[code] = false;
            return false;
        }
        return true;
    }
    return false;
};

KeyboardState.prototype.listen = function () {
    document.addEventListener('keydown', this.boundKeyup, false);
    document.addEventListener('keyup', this.boundKeydown, false);
};

KeyboardState.prototype.stopListening = function () {
    document.removeEventListener('keydown', this.keyDownHandler);
    document.removeEventListener('keyup', this.keyUpHandler);
};

module.exports = {
    KeyboardState: KeyboardState,
};
