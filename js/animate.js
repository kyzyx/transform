var AnimEventManager = function() {
    var counter = 0;
    var waiting = false;
    var f = function() {;};
    var startHandler = function() {
        counter++;
    };
    var endHandler = function() {
        --counter;
        this.style['-webkit-animation-play-state'] = 'paused';
        this.style['MozAnimationPlayState'] = 'paused';
        this.style['animation-play-state'] = 'paused';
        if (waiting && counter == 0) {
            f();
            waiting = false;
        }
    };
    var elts = [];
    var that = {
        reset: function() {
            elts.forEach(function(e) {
                e.style['-webkit-animation-name'] = '';
                e.style['animation-name'] = '';
                e.style['MozAnimationName'] = '';
            });
            // Hack triggers reflow and reenables animation
            elts[0].offsetWidth = elts[0].offsetWidth;
        },
        start: function(fun) {
            elts.forEach(function(e) {
                e.style['-webkit-animation-play-state'] = 'running';
                e.style['animation-play-state'] = 'running';
                e.style['MozAnimationPlayState'] = 'running';
                e.style['-webkit-animation-name'] = e.getAttribute('animationname');
                e.style['animation-name'] = e.getAttribute('animationname');
                e.style['MozAnimationName'] = e.getAttribute('animationname');
            });
            waiting = true;
            if (fun) f = fun;
        },
        addListeners: function(e) {
            elts.push(e.elt());
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

function animate(params, matches, unmatched1, unmatched2) {
    if (typeof unmatched1 == 'undefined') {
        unmatched1 = matches.unmatched1;
        unmatched2 = matches.unmatched2;
        matches = matches.matches;
    }
    var animfun, outfun, infun;
    if (typeof params == 'function') {
        animfun = params;
    } else {
        animfun = params.animatefun;
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
        v.e1.elt().style['-webkit-animation-play-state'] = 'paused';
        v.e1.elt().style['MozAnimationPlayState'] = 'paused';
        v.e1.elt().style['animation-play-state'] = 'paused';
        csstext += animfun(v.e1, v.e2, v.p1, v.p2, params, sheet);
        evManager.addListeners(v.e1);
    });
    if (params.hasOwnProperty('outfun')) {
        outfun = params.outfun;
        unmatched1.forEach(function(v) {
            v.e.elt().style['-webkit-animation-play-state'] = 'paused';
            v.e.elt().style['MozAnimationPlayState'] = 'paused';
            v.e.elt().style['animation-play-state'] = 'paused';
            csstext += outfun(v.e, v.p, params, sheet);
            evManager.addListeners(v.e);
        });
    }
    if (params.hasOwnProperty('infun')) {
        infun = params.infun;
        unmatched2.forEach(function(v) {
            v.e.elt().style['-webkit-animation-play-state'] = 'paused';
            v.e.elt().style['MozAnimationPlayState'] = 'paused';
            v.e.elt().style['animation-play-state'] = 'paused';
            csstext += infun(v.e, v.p, params, sheet);
            evManager.addListeners(v.e);
        });
    }
    if (sheet.styleSheet) {
        sheet.styleSheet.cssText += "\n" + csstext;
    } else {
        sheet.appendChild(document.createTextNode(csstext));
    }
    return evManager;
}
