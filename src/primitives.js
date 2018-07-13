'use strict';

var Sphere = function () {

};

var Cube = function () {

};

var Pill = function () {

};

var Pyramid = function () {

};

var Circle = function (radius, slices) {
    var delta = 2 * Math.PI / slices;
    var currentAngle = 0;
    var points = [];
    var i = slices;
    var res = [];
    var currentPoint, nextPoint;
    while (i--) {
        points.push([
            radius * Math.cos(currentAngle),
            radius * Math.sin(currentAngle)
        ]);
        currentAngle += delta;
    }
    for (i = 0; i < slices; i++) {
        currentPoint = points[i];
        nextPoint = points[(i + 1) % slices];
        res.push(
            [0, 0],
            currentPoint,
            nextPoint
        );
    }
    return res;
};

var Square = function () {

};

var Oval = function () {

};

var Triangle = function () {

};

module.exports = {
    shapes: {
        planar: {
            Circle: Circle,
            Square: Square,
            Oval: Oval,
            Triangle: Triangle,
        },
        spatial: {
            Sphere: Sphere,
            Cube: Cube,
            Pill: Pill,
            Pyramid: Pyramid,
        },
    },
    paths: {

    }
};
