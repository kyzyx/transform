function addCSSRule(sheet, selector, rules, index) {
    if(sheet.insertRule) {
        console.log(selector + "{" + rules + "}");
        sheet.insertRule(selector + "{" + rules + "}", index);
    }
    else {
        sheet.addRule(selector, rules, index);
    }
}

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
    var donefun = function() {;};
    if (typeof callbacks == 'function') {
        animfun = callbacks;
    } else {
        animfun = callbacks.animate;
        donefun = callbacks.done;
    }
    var sheet = (function() {
        var style = document.createElement("style");
        style.setAttribute('type', 'text/css');
        document.head.appendChild(style);
        return style;
    })();

    var evManager = AnimEventManager();

    matches.forEach(function(v) {
        animfun(v.e1, v.e2, v.p1, v.p2, sheet);
        evManager.addListeners(v.e1);
    });
    evManager.wait(donefun);
}

var numanims = 0;
function line2d(e1, e2, p1, p2, sheet) {
    // Create keyframes:
    var name = 'anim' + numanims++;
    var rule = "0%{left:" + p1[0] + ";top:" + p1[1] + ";}";
    rule += "100%{left:" + p2[0] + ";top:" + p2[1] + ";}";

    // Specify animation params
    var duration = '2s';
    var delay = (Math.random()*0.5) + 's';

    var css = "@keyframes " + name + "{" + rule + "}";
    if (sheet.styleSheet) {
        sheet.styleSheet.cssText += "\n" + css;
    } else {
        sheet.appendChild(document.createTextNode(css));
    }
    css = "@-webkit-keyframes " + name + "{" + rule + "}";
    if (sheet.styleSheet) {
        sheet.styleSheet.cssText += "\n" + css;
    } else {
        sheet.appendChild(document.createTextNode(css));
    }
    // Run animation
    e1.elt().style['animation-duration'] = duration;
    e1.elt().style['animation-name'] = name;
    e1.elt().style['animation-delay'] = delay;
    e1.elt().style['-webkit-animation-duration'] = duration;
    e1.elt().style['-webkit-animation-name'] = name;
    e1.elt().style['-webkit-animation-fill-mode'] = 'forwards';
    e1.elt().style['-webkit-animation-delay'] = delay;
    e1.elt().style['position'] = 'absolute';
    e1.elt().style['left'] = p1[0];
    e1.elt().style['top'] = p1[1];
}
