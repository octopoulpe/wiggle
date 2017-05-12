'use strict';

var KeyboardState = function () {
    this.keystates = {};
    this.boundKeyup = this.keyup.bind(this);
    this.boundKeydown = this.keydown.bind(this);
};

KeyboardState.prototype.keyup = function (event) {
    this.keystates[event.key] = true;
};

KeyboardState.prototype.keydown = function (event) {
    if (this.keystates[event.key]) {
        this.keystates[event.key] = false;
    }
};

KeyboardState.prototype.keyChecker = function (key) {
    return function () {
        return this.isPressed(key);
    }.bind(this);
};

KeyboardState.prototype.isPressed = function (key) {
    if (this.keystates[key]) {
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
