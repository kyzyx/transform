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

// Constraints on entity values: Must have equality checks
