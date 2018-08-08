'use strict';

// Some simple 2d Maths

function sum (p, q) {
    return [q[0] + p[0], q[1] + p[1]];
}

function diff (p, q) {
    return [q[0] - p[0], q[1] - p[1]];
}

function cross (p, q) {
    return p[0] * q[1] - p[1] * q[0];
}

function perp (p) {
    return [-p[1], p[0]];
}

function scale (p, k) {
    return [k*p[0], k*p[1]];
}

function mid (p, q) {
    var padding = diff(p, q);
    return [p[0] + padding[0] / 2, p[1] + padding[1] / 2];
}

function neg (p) {
    return [-p[0], -p[1]];
}

function length (p) {
    return Math.sqrt(p[0]*p[0] + p[1]*p[1]);
}

function norm (p, fact) {
    fact = fact || 1;
    return scale(p, fact / length(p));
}

function dot (p, q) {
    return p[0] * q[0] + p[1] * q[1];
}

function intersection (p, p2, q, q2) {
    var r = diff(p, p2);
    var s = diff(q, q2);
    var rxs = cross(r, s);
    var t = cross(diff(p, q), s) / rxs;
    return sum(p, scale(r, t));
}

module.exports = {
    sum: sum,
    diff: diff,
    cross: cross,
    intersection: intersection,
    dot: dot,
    perp: perp,
    mid: mid,
    neg: neg,
    scale: scale,
    length: length,
    norm: norm,
};
