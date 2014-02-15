// An entity is an individual element with its own identity and position that
// can get mapped to other compatible entities in different positions.
// Entity value elements must support equality and less than checks.
var Entity = function(e,v) {
    var elt = e;
    var val = v;
    
    var that = {
        equals: function(v) {
            if (typeof val.equals == 'function')
                return val.equals(v.value());
            else
                return v.value() == val;
        },
        lessThan: function(v) {
            if (typeof val.less == 'function')
                return val.less(v.value());
            else
                return val < v.value();
        },
        isCompatible: function(v) {
            return true;
        },
        elt: function() { return elt; },
        value: function() { return val; },
    };
    return that;
}


// Character or text entity that only matches if same computed style
var StyledEntity = function(e,v) {
    var elt = e;
    var val = v;
    var styles = window.getComputedStyle(elt);
    var attrs = [
        'color',
        'backgroundColor',
        'fontFamily',
        'fontSize',
        'fontStyle',
        'fontVariant',
        'fontWeight',
        'textDecoration',
        ];

    var that = {
        equals: function(v) {
            if (val != v.value()) return false;
            //console.log("Vals equal");
            for (var i = 0; i < attrs.length; ++i) {
                //console.log(attrs[i] + ":" + v.attr(attrs[i]) + " " + styles[attrs[i]]);
                if (v.attr(attrs[i]) != styles[attrs[i]]) {
                    return false;
                }
            }
            return true;
        },
        lessThan: function(v) {
            if (val == v.value()) {
                for (var i = 0; i < attrs.length; ++i) {
                    if (styles[attrs[i]] != v.attr(attrs[i])) {
                        return styles[attrs[i]] < v.attr(attrs[i]);
                    }
                }
                return false;
            } else {
                return val < v.value();
            }
        },
        attr: function(a) { return styles[a]; },
        elt: function() { return elt; },
        value: function() { return val; },
    };

    return that;
}
