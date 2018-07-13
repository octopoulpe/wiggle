'use strict';

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

KeyboardState.prototype.isPressed = function (code) {
    if (this.keystates[code]) {
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
