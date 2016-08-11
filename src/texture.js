"use strict";

var ctx = require("./context").ctx;

var Texture = function () {
    this._glTexture = ctx().gl.createTexture();
    this._image = new Image();
    this._image.onload = this._onload.bind(this);
    this._poolGet();
};

Texture.usedTexturesIdx = [];

Texture.prototype._poolGet = function () {
    var idxToUse = null;

    for (var i = 0; i < Texture.usedTexturesIdx.length; i++) {
        if (!Texture.usedTexturesIdx[i]) {
            // mark this as used
            Texture.usedTexturesIdx[i] = true;
            idxToUse = i;
            break;
        }
    }
    if (idxToUse === null) {
        idxToUse = Texture.usedTexturesIdx.push(true) - 1;
    }
    this.texIdx = i;
    this._texIdentifier = ctx().gl["TEXTURE" + i];
};

Texture.prototype._poolRelease = function () {
    Texture.usedTexturesIdx[this.texIdx] = false;
    this.texIdx = null;
    this._texIdentifier = null;
};

Texture.prototype.free = function () {
    this._image.src = '';
    this._poolRelease();
};

Texture.prototype.load = function (url, loadCb) {
    this._image.src = url;
    this._loadCb = loadCb;
};

Texture.prototype._onload = function () {
    var gl = ctx().gl;
    gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    if (this._loadCb) {
        this._loadCb();
    }
};

Texture.prototype.enable = function () {
    var gl = ctx().gl;
    gl.activeTexture(this._texIdentifier);
    gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
};

module.exports = Texture;
