var AnimEventManager = function() {
    var counter = 0;
    var waiting = false;
    var f = function() {;};
    var startHandler = function() {
        counter++;
    };
    var endHandler = function() {
        --counter;
        if (waiting && counter == 0) {
            f();
        }
    };
    var that = {
        wait: function(fun) {
            waiting = true;
            if (fun) f = fun;
        },
        addListeners: function(e) {
            e.elt().addEventListener('animationstart', startHandler, false);
            e.elt().addEventListener('webkitAnimationStart', startHandler, false);
            e.elt().addEventListener('oanimationstart', startHandler, false);
            e.elt().addEventListener('MSAnimationStart', startHandler, false);
            e.elt().addEventListener('animationend', endHandler, false);
            e.elt().addEventListener('webkitAnimationEnd', endHandler, false);
            e.elt().addEventListener('oanimationend', endHandler, false);
            e.elt().addEventListener('MSAnimationEnd', endHandler, false);
        },
    };
    return that;
}

function animate(callbacks, matches, unmatched1, unmatched2) {
    if (typeof unmatched1 == 'undefined') {
        unmatched1 = matches.unmatched1;
        unmatched2 = matches.unmatched2;
        matches = matches.matches;
    }
    var animfun;
    var params;
    var donefun = function() {;};
    if (typeof callbacks == 'function') {
        animfun = callbacks;
    } else {
        animfun = callbacks.animate;
        if (callbacks.hasOwnProperty('done')) donefun = callbacks.done;
        if (callbacks.hasOwnProperty('params')) params = callbacks.params;
    }
    var sheet = (function() {
        var style = document.createElement("style");
        style.setAttribute('type', 'text/css');
        document.head.appendChild(style);
        return style;
    })();

    var evManager = AnimEventManager();

    var csstext = "";
    matches.forEach(function(v) {
        csstext += animfun(v.e1, v.e2, v.p1, v.p2, params, sheet);
        evManager.addListeners(v.e1);
    });
    if (sheet.styleSheet) {
        sheet.styleSheet.cssText += "\n" + csstext;
    } else {
        sheet.appendChild(document.createTextNode(csstext));
    }
    evManager.wait(donefun);
}

var numanims = 0;
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
    // Run animation
    e1.elt().style['animation-duration'] = duration;
    e1.elt().style['animation-fill-mode'] = 'forwards';
    e1.elt().style['animation-delay'] = delay;
    e1.elt().style['animation-timing-function'] = params.easing;
    e1.elt().style['-webkit-animation-duration'] = duration;
    e1.elt().style['-webkit-animation-fill-mode'] = 'forwards';
    e1.elt().style['-webkit-animation-delay'] = delay;
    e1.elt().style['-webkit-animation-timing-function'] = params.easing;
    e1.elt().style['MozAnimationDuration'] = duration;
    e1.elt().style['MozAnimationFillMode'] = 'forwards';
    e1.elt().style['MozAnimationDelay'] = delay;
    e1.elt().style['MozAnimationTimingFunction'] = params.easing;
    e1.elt().style['position'] = 'absolute';
    e1.elt().style['left'] = p1[0];
    e1.elt().style['top'] = p1[1];
    e1.elt().style['animation-name'] = name;
    e1.elt().style['-webkit-animation-name'] = name;
    e1.elt().style['MozAnimationName'] = name;

    return css;
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
    // Run animation
    e1.elt().style['animation-duration'] = duration;
    e1.elt().style['animation-fill-mode'] = 'forwards';
    e1.elt().style['animation-delay'] = delay;
    e1.elt().style['animation-timing-function'] = 'linear';
    e1.elt().style['-webkit-animation-duration'] = duration;
    e1.elt().style['-webkit-animation-fill-mode'] = 'forwards';
    e1.elt().style['-webkit-animation-delay'] = delay;
    e1.elt().style['-webkit-animation-timing-function'] = 'linear';
    e1.elt().style['MozAnimationDuration'] = duration;
    e1.elt().style['MozAnimationFillMode'] = 'forwards';
    e1.elt().style['MozAnimationDelay'] = delay;
    e1.elt().style['MozAnimationTimingFunction'] = 'linear';
    e1.elt().style['position'] = 'absolute';
    e1.elt().style['left'] = p1[0];
    e1.elt().style['top'] = p1[1];
    e1.elt().style['animation-name'] = name;
    e1.elt().style['-webkit-animation-name'] = name;
    e1.elt().style['MozAnimationName'] = name;
    return css;
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
