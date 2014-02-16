var numanims = 0;
function fadeout(e, p, params, sheet) {
    var defaultparams = {
        outduration: 2,
        outdelay: 0.1,
    };
    if (!params) params = defaultparams;
    else {
        if (!params.hasOwnProperty('outduration') && params.hasOwnProperty('duration')) {
            params.outduration = params.duration;
        }
        for (param in defaultparams) {
            if (!(params.hasOwnProperty(param))) {
                params[param] = defaultparams[param];
            }
        }
    }
    // Create keyframes:
    var name = 'anim' + numanims++;
    var rule = "0%{opacity:1} 100%{opacity:0}";

    var css = "@keyframes " + name + "{" + rule + "}\n" +
        "@-webkit-keyframes " + name + "{" + rule + "}\n";
    var style = function(e) {
        setStyle(e, 'animation-duration', params.outduration + 's', true);
        setStyle(e, 'animation-fill-mode', 'forwards', true);
        setStyle(e, 'animation-delay', params.outdelay + 's', true);
        setStyle(e, 'animation-timing-function', 'linear', true);
        setStyle(e, 'position', 'absolute');
        setStyle(e, 'opacity', 1);
        setStyle(e, 'left', p[0] + 'px');
        setStyle(e, 'top', p[1] + 'px');
    };
    return {css: css, animname: name, setupfun: style};
}
function fadein(e, p, params, sheet) {
    var defaultparams = {
        induration: 2,
        indelay: 0.5,
    };
    if (!params) params = defaultparams;
    else {
        if (!params.hasOwnProperty('induration') && params.hasOwnProperty('duration')) {
            params.induration = params.duration;
        }
        for (param in defaultparams) {
            if (!(params.hasOwnProperty(param))) {
                params[param] = defaultparams[param];
            }
        }
    }
    // Create keyframes:
    var name = 'anim' + numanims++;
    var rule = "0%{opacity:0} 100%{opacity:1}";

    var css = "@keyframes " + name + "{" + rule + "}\n" +
        "@-webkit-keyframes " + name + "{" + rule + "}\n";
    var style = function(e) {
        setStyle(e, 'animation-duration', params.induration + 's', true);
        setStyle(e, 'animation-fill-mode', 'forwards', true);
        setStyle(e, 'animation-delay', params.indelay + 's', true);
        setStyle(e, 'animation-timing-function', 'linear', true);
        setStyle(e, 'position', 'absolute');
        setStyle(e, 'opacity', 0);
        setStyle(e, 'left', p[0] + 'px');
        setStyle(e, 'top', p[1] + 'px');
    };
    return {css: css, animname: name, setupfun: style};
}

function line2d(e1, e2, p1, p2, params, sheet) {
    // Set up animation parameters
    var defaultparams = {
        duration: 2,
        duration_variance: 0,
        delayamount: 0.5,
        easing: 'ease-in-out',
        constant_speed: -1,
    };
    if (!params) params = defaultparams;
    else {
        for (param in defaultparams) {
            if (!(params.hasOwnProperty(param))) {
                params[param] = defaultparams[param];
            }
        }
    }
    var duration;
    if (params.constant_speed > 0) {
        duration = (Math.sqrt(euclideanDist2(p1, p2))/params.constant_speed) + 's';
    } else {
        duration = (params.duration + (2*Math.random()-1)*params.duration_variance) + 's';
    }
    var delay = (Math.random()*params.delayamount) + 's';

    // Create keyframes:
    var name = 'anim' + numanims++;
    var rule = "0%{left:" + p1[0] + ";top:" + p1[1] + ";}";
    rule += "100%{left:" + p2[0] + ";top:" + p2[1] + ";}";


    var css = "@keyframes " + name + "{" + rule + "}\n" +
        "@-webkit-keyframes " + name + "{" + rule + "}\n";
    var style = function(e) {
        e2.elt().style['visibility'] = 'hidden';
        setStyle(e, 'animation-duration', duration, true);
        setStyle(e, 'animation-fill-mode', 'forwards', true);
        setStyle(e, 'animation-delay', delay, true);
        setStyle(e, 'animation-timing-function', params.easing, true);
        setStyle(e, 'position', 'absolute');
        setStyle(e, 'left', p1[0] + 'px');
        setStyle(e, 'top', p1[1] + 'px');
    };
    return {css: css, animname: name, setupfun: style};
}

function manhattan2d(e1, e2, p1, p2, params, sheet) {
    // Revert to linear if new position shares a coordinate
    if (p1[0] == p2[0] || p1[1] == p2[1]) {
        return line2d(e1, e2, p1, p2, params, sheet);
    }
    // Set up animation parameters
    var defaultparams = {
        duration: 2,
        duration_variance: 0.5,
        delayamount: 0.5,
        easing: 'ease-in-out',
        segments_max: 5,
        segments_min: 3,
        segment_length_variance: 0.5,
        constant_speed: -1,
    };

    if (!params) params = defaultparams;
    else {
        for (param in defaultparams) {
            if (!(params.hasOwnProperty(param))) {
                params[param] = defaultparams[param];
            }
        }
    }
    if (params.segments_max < params.segments_min) {
        var tmp = params.segments_max;
        params.segments_max = params.segments_min;
        params.segments_min = tmp;
    }
    var d = manhattanDist(p1, p2);
    var minseg = Math.max(2,params.segments_min);
    var maxseg = Math.max(minseg,params.segments_max);
    var duration;
    if (params.constant_speed > 0) {
        duration = (d/params.constant_speed) + 's';
    } else {
        duration = (params.duration + (2*Math.random()-1)*params.duration_variance) + 's';
    }
    var delay = (Math.random()*params.delayamount) + 's';
    var numsegs = Math.floor(Math.random()*(maxseg-minseg)) + minseg;
    var coord = Math.random() > 0.5?0:1;

    // Create keyframes:
    var name = 'anim' + numanims++;
    var rule = "0%{left:" + p1[0] + ";top:" + p1[1] + ";}";
    var currpos = [p1[0], p1[1]];
    var percent = 0;
    for (var i = 0; i < numsegs-1; ++i) {
        var parallelsegsleft = Math.floor((numsegs-i+1)/2);
        var multiplier = 1;//+(2*Math.random()-1)*params.segment_length_variance;
        var amount = multiplier*(p2[coord] - currpos[coord])/parallelsegsleft;
        if (params.constant_speed < 0) {
            percent = Math.round(100*(i+1)/numsegs)
        } else {
            percent += Math.round(100*Math.abs(amount)/d);
        }
        currpos[coord] += amount;
        rule += percent + "%{left:" + currpos[0] + ";top:" + currpos[1] + ";}";
        coord = 1 - coord;
    }
    rule += "100%{left:" + p2[0] + ";top:" + p2[1] + ";}";


    var css = "@keyframes " + name + "{" + rule + "}\n" +
        "@-webkit-keyframes " + name + "{" + rule + "}\n";
    var style = function(e) {
        e2.elt().style['visibility'] = 'hidden';
        setStyle(e, 'animation-duration', duration, true);
        setStyle(e, 'animation-fill-mode', 'forwards', true);
        setStyle(e, 'animation-delay', delay, true);
        setStyle(e, 'animation-timing-function', 'linear', true);
        setStyle(e, 'position', 'absolute');
        setStyle(e, 'left', p1[0] + 'px');
        setStyle(e, 'top', p1[1] + 'px');
    };
    return {css: css, animname: name, setupfun: style};
}

function manhattanDist(p1, p2) {
    var d = 0;
    for (var i = 0; i < p1.length; ++i) {
        d += Math.abs(p2[i] - p1[i]);
    }
    return d;
}
function euclideanDist2(p1, p2) {
    var d = 0;
    for (var i = 0; i < p1.length; ++i) {
        d += (p2[i] - p1[i])*(p2[i] - p1[i]);
    }
    return d;
}
function euclidean2dConstantTime(matches, params) {
    var maxd = 0;
    matches.forEach(function(v) {
        var d = euclideanDist2(v.p1, v.p2);
        if (d > maxd) maxd = d;
    });
    return Math.sqrt(maxd)/params.duration;
}
function manhattan2dConstantTime(matches, params) {
    var maxd = 0;
    matches.forEach(function(v) {
        var d = manhattanDist(v.p1, v.p2);
        if (d > maxd) maxd = d;
    });
    return maxd/params.duration;
}

function explode3d(e1, e2, p1, p2, params, sheet) {
    // Set up animation parameters
    var defaultparams = {
        duration: 2,
        duration_variance: 0,
        radius: 120,
        inradius: 0.2,
        outradius: 0.25,
        centerx: 0,
        centery: 0,
        delayamount: 0.5,
        perspective: 2,
        zscale: 1,
        parentelt: null,
    };
    if (!params) params = defaultparams;
    else {
        for (param in defaultparams) {
            if (!(params.hasOwnProperty(param))) {
                params[param] = defaultparams[param];
            }
        }
    }
    var angle = 0;
    var duration = params.duration + 's';
    var delay = (Math.random()*params.delayamount) + 's';
    var x = params.centerx;
    var y = params.centery;
    var perspective = params.perspective*(params.radius + params.outradius);
    if (params.parentelt) {
        // Scale angle by distance from center
        params.parentelt.style['perspective'] = perspective + 'px';
        params.parentelt.style['-webkit-perspective'] = perspective + 'px';
        params.parentelt.style['MozPerspective'] = perspective + 'px';
        params.parentelt.style['perspective-origin'] = x + 'px ' + y + 'px';
        params.parentelt.style['-webkit-perspective-origin'] = x + 'px ' + y + 'px';
        params.parentelt.style['MozPerspectiveOrigin'] = x + 'px ' + y + 'px';
    }
    var imp = [0,0,0]
    var exp = [0,0,0];
    if (p1) {
        var dx1 = p1[0] - x;
        var dy1 = p1[1] - y;
        var d = Math.sqrt(dx1*dx1 + dy1*dy1);
        if (params.parentelt) angle = (Math.random()-0.5)*Math.PI/(1 + d*d/9000);
        // Calculate imploded position
        var r = 1 - params.inradius*Math.random();
        imp = [r*dx1 + x, r*dy1 + y, 0.5];

        // Calculate exploded position
        dx1/=d; dy1/=d;
        r = params.radius*(1 + params.outradius*(2*Math.random()-1));
        exp = [
            Math.cos(angle)*r*dx1 + p1[0],
            Math.cos(angle)*r*dy1 + p1[1],
            Math.sin(angle)*r*params.zscale
        ];
    } else {
        var n = Math.random()*2*Math.PI;
        var dx1 = Math.cos(n);
        var dy1 = Math.sin(n);
        var sina = Math.sin(angle);
        var cosa = Math.cos(angle);
        // Ensure angle and radius result in an offscreen location
        var coords = getCoords(e1);
        var dims = [window.innerWidth, window.innerHeight];
        var r;
        // Check distance needed for z-axis offscreen
        if (angle > 0) r = (perspective+5)/sina;
        else r = -(perspective*2)/sina;
        // Check distance needed for x-axis offscreen
        if (dx1 > 0) r = Math.min(r, (dims[0]-coords[0])/dx1);
        else r = Math.min(r, -coords[0]/dx1);
        // Check distance needed for y-axis offscreen
        if (dy1 > 0) r = Math.min(r, (dims[1]-coords[1])/dy1);
        else r = Math.min(r, -coords[1]/dy1);

        exp = [cosa*r*dx1, cosa*r*dy1, sina*r*params.zscale];
    }

    // Create keyframes:
    var name = 'anim' + numanims++;
    var initialtransform;

    if (p1) initialtransform = 'translate3d(' + p1[0] + 'px,' + p1[1] + 'px,0px)';
    else    initialtransform = 'translate3d(' + exp[0] + 'px,' + exp[1] + 'px,' + exp[2] + 'px)';
    var explodeease = 'cubic-bezier(0.05,0.9,0.5,0.95)';
    var transform = initialtransform;
    var rule = '';
    rule += '0%{transform: '+transform+';-webkit-transform:'+transform+';animation-timing-function:ease-out;-webkit-animation-timing-function:ease-out}';
    if (p1) {
        transform = 'translate3d(' + imp[0] + 'px,' + imp[1] + 'px,' + imp[2] + 'px)';
        rule += '15%{transform: '+transform+';-webkit-transform:'+transform+';animation-timing-function:' + explodeease + ';-webkit-animation-timing-function:' + explodeease + '}';
        transform = 'translate3d(' + exp[0] + 'px,' + exp[1] + 'px,' + exp[2] + 'px)';
    }
    rule += '90%{transform: '+transform+';-webkit-transform:'+transform+';animation-timing-function:ease-in;-webkit-animation-timing-function:ease-in}';
    if (p2) {
        transform = 'translate3d(' + p2[0] + 'px,' + p2[1] + 'px,0px)';
    }
    rule += '100%{transform: '+transform+';-webkit-transform:'+transform+'}';

    var css = "@keyframes " + name + "{" + rule + "}\n" +
        "@-webkit-keyframes " + name + "{" + rule + "}\n";

    var style = function(e) {
        if (p1 && p2) e2.elt().style['visibility'] = 'hidden';
        setStyle(e, 'animation-duration', duration, true);
        setStyle(e, 'animation-fill-mode', 'forwards', true);
        setStyle(e, 'animation-delay', delay, true);
        setStyle(e, 'transform', initialtransform, true);
        setStyle(e, 'position', 'absolute');
        setStyle(e, 'left', '0px');
        setStyle(e, 'top', '0px');
    };
    return {css: css, animname: name, setupfun: style};
}

function calcCenter(m) {
    var avg = [0,0];
    var n = 0;
    m.matches.forEach(function(v) {
        ++n;
        avg[0] += v.p1[0];
        avg[1] += v.p1[1];
    });
    m.unmatched1.forEach(function(v) {
        ++n;
        avg[0] += v.p1[0];
        avg[1] += v.p1[1];
    });
    avg[0] /= n;
    avg[1] /= n;
    return avg;
}

function explodeout(e, p, params, sheet) {
    return explode3d(e,null,p,null,params,sheet);
}
function explodein(e, p, params, sheet) {
    return explode3d(e,null,null,p,params,sheet);
}
