"use strict";
var ctx = require("./context").ctx;

var unifNameParser = /(\w+)\[?(\d+)?\]?\.?(\w+)?/;

var Shader = function () {
    this.attributes = {};
    this.uniforms = {};
    this._program = null;
};

Shader.prototype._getShader = function (sourceCode, shaderType) {
    var gl = ctx().gl;
    var shader = gl.createShader(shaderType);

    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
};

Shader.prototype._createUnifCallable = function (active) {
    var context = ctx();
    return context.globs.unifMap[active.type].bind(
        context.gl,
        context.gl.getUniformLocation(
            this._program,
            active.name
        )
    );
};

Shader.prototype._insertCallable = function (active, unifCallable) {
    var parsedName = unifNameParser.exec(active.name);
    var basePart = parsedName[1];
    var arrPart = parsedName[2];
    var subPart = parsedName[3];

    if (arrPart) {
        if (!this.uniforms[basePart]) {
            this.uniforms[basePart] = [];
        }
        if (subPart) {
            if (!this.uniforms[basePart][arrPart]) {
                this.uniforms[basePart][arrPart] = {};
            }
            this.uniforms[basePart][arrPart][subPart] = unifCallable;
        } else {
            this.uniforms[basePart][arrPart] = unifCallable;
        }
    } else {
        if (subPart) {
            if (!this.uniforms[basePart]) {
                this.uniforms[basePart] = {};
            }
            this.uniforms[basePart][subPart] = unifCallable;
        } else {
            this.uniforms[basePart] = unifCallable;
        }
    }
};

Shader.prototype._parseUniforms = function () {
    var gl = ctx().gl;
    var shaderProgram = this._program;
    var unifCount = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
    var unifCallable, active;

    for (var i = 0; i < unifCount; i++) {
        active = gl.getActiveUniform(shaderProgram, i);
        unifCallable = this._createUnifCallable(active);
        this._insertCallable(active, unifCallable);
    }
};

Shader.prototype._parseAttributes = function () {
    var context = ctx();
    var gl = context.gl;
    var shaderProgram = this._program;
    var attribCount = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
    var active;

    for (var i = 0; i < attribCount; i++) {
        active = gl.getActiveAttrib(shaderProgram, i);
        var attrHandler = gl.getAttribLocation(shaderProgram, active.name);
        this.attributes[active.name] = {
            size: context.globs.attrMap[active.type],
            handler: attrHandler,
        };
    }
};

Shader.prototype.init = function (vsSource, fsSource) {
    var gl = ctx().gl;

    var vertexShader = this._getShader(vsSource, gl.VERTEX_SHADER);
    var fragmentShader = this._getShader(fsSource, gl.FRAGMENT_SHADER);

    var shaderProgram = gl.createProgram();
    this._program = shaderProgram;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Could not initialise shaders');
    }

    this._parseUniforms();
    this._parseAttributes();

    gl.useProgram(shaderProgram);
};

Shader.prototype.use = function () {
    var context = ctx();
    context.gl.useProgram(this._program);
    context.shaderInUse = this;
};

module.exports = Shader;
