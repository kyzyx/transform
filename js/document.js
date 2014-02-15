var Document = function() {
    var entities = [];

    var that = {
        addEntity: function(e,x) {
            var hi = entities.length;
            var lo = 0;
            var mid = -1;
            while (hi > lo) {
                mid = Math.floor((hi+lo)/2);
                if (entities[mid].entity.lessThan(e)) lo = mid+1;
                else if (e.lessThan(entities[mid].entity)) hi = mid;
                else break;
            }
            mid = Math.floor((hi+lo)/2);
            entities.splice(mid, 0, {entity:e,pos:x});
        },
        eachEntity: function(f) {
            for (var i = 0; i < entities.length; ++i) {
                f(entities[i].entity, entities[i].pos);
            }
        },
        filterEntity: function(f) {
            var f2 = function(v) { return f(v.entity, v.pos); };
            return entities.filter(f2);
        },
        entities: function() { return entities; },
    };
    return that;
};
