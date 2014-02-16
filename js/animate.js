function setStyle(e,k,v,prefix) {
    e.style[k] = v;
    if (prefix) {
        e.style['-webkit-' + k] = v;
        var mozilla = 'Moz';
        var res = k.split('-').map(function(s) {
            var s2 = s;
            s2[0] = s2[0].toUpperCase();
            return s2;
        }).join('');
        e.style[mozilla] = v;
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
        this.style['-webkit-animation-play-state'] = 'paused';
        this.style['MozAnimationPlayState'] = 'paused';
        this.style['animation-play-state'] = 'paused';
        if (waiting && counter == 0) {
            f();
            waiting = false;
        }
    };
    var elts = [];
    var animations = [];
    var that = {
        reset: function() {
            for (var i = 0; i < elts.length; ++i) {
                setStyle(elts[i], 'animation-name', '', true);
                elts[i].style['visibility'] = 'visible';
                if (animations[i].setupfun) animations[i].setupfun(elts[i]);
            }
            // Hack triggers reflow and reenables animation
            elts[0].offsetWidth = elts[0].offsetWidth;
        },
        start: function(fun) {
            for (var i = 0; i < elts.length; ++i) {
                elts[i].style['-webkit-animation-play-state'] = 'running';
                elts[i].style['animation-play-state'] = 'running';
                elts[i].style['MozAnimationPlayState'] = 'running';
                elts[i].style['-webkit-animation-name'] = animations[i].animname;
                elts[i].style['animation-name'] = animations[i].animname;
                elts[i].style['MozAnimationName'] = animations[i].animname;
            }
            waiting = true;
            if (fun) f = fun;
        },
        prepareElement: function(e,info) {
            elts.push(e.elt());
            animations.push(info);
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
        var inf = animfun(v.e1, v.e2, v.p1, v.p2, params, sheet);
        csstext += inf.css;
        evManager.prepareElement(v.e1, inf);
    });
    if (params.hasOwnProperty('outfun') && typeof params.outfun == 'function') {
        outfun = params.outfun;
        unmatched1.forEach(function(v) {
            v.e.elt().style['-webkit-animation-play-state'] = 'paused';
            v.e.elt().style['MozAnimationPlayState'] = 'paused';
            v.e.elt().style['animation-play-state'] = 'paused';
            var inf = outfun(v.e, v.p, params, sheet);
            csstext += inf.css;
            evManager.prepareElement(v.e, inf);
        });
    }
    if (params.hasOwnProperty('infun') && typeof params.infun == 'function') {
        infun = params.infun;
        unmatched2.forEach(function(v) {
            v.e.elt().style['-webkit-animation-play-state'] = 'paused';
            v.e.elt().style['MozAnimationPlayState'] = 'paused';
            v.e.elt().style['animation-play-state'] = 'paused';
            var inf = infun(v.e, v.p, params, sheet);
            csstext += inf.css;
            evManager.prepareElement(v.e, inf);
        });
    }
    if (sheet.styleSheet) {
        sheet.styleSheet.cssText += "\n" + csstext;
    } else {
        sheet.appendChild(document.createTextNode(csstext));
    }
    return evManager;
}
