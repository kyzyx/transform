// TODO: Allow compatibility customization
var Entity = function(e,v) {
    var elt = e;
    var val = v;
    
    var that = {
        isEqual: function(v) {
            return v.value() == val;
        },
        isCompatible: function(v) {
            return true;
        },
        elt: function() { return elt; },
        value: function() { return val; },
    };
    return that;
}

// Constraints on entity values: Must have equality checks
