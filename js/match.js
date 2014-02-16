// Takes in two documents
// Returns {matches, unmatched1, unmatched2}
// matches is a list of edges: {e1, e2, p1, p2}
// Unmatched is a list of nodes: {e, p}
function constructMatchesEqual (doc1, doc2) {
    var j = 0;
    var l1 = doc1.entities();
    var l2 = doc2.entities();

    var unmatched1 = [];
    var unmatched2 = [];
    var matches = [];

    for (var i = 0; i < l1.length; ++i) {
        while (j < l2.length && l2[j].entity.lessThan(l1[i].entity)) {
            unmatched2.push({e:l2[j].entity, p:l2[j].pos});
            ++j;
        }
        if (j < l2.length && l1[i].entity.equals(l2[j].entity)) {
            if (i == 0 || !l1[i].entity.equals(l1[i-1].entity)) {
                // Count number of equal elements in l2
                var nequal = 0;
                while (j+nequal < l2.length && l2[j+nequal].entity.equals(l1[i].entity)) {
                    nequal++;
                }
                // Shuffle
                for (var k = nequal-1; k >= 1; --k) {
                    var r = Math.floor(Math.random()*(k+1));
                    var tmp = l2[j+r];
                    l2[j+r] = l2[j+k];
                    l2[j+k] = tmp;
                }
            }
            matches.push({e1:l1[i].entity,
                e2:l2[j].entity,
                p1:l1[i].pos,
                p2:l2[j].pos
            });
            ++j;
        }
        else {
            unmatched1.push({e:l1[i].entity, p:l1[i].pos});
        }
    }
    for (; j < l2.length; ++j) {
        unmatched2.push({e:l2[j].entity, p:l2[j].pos});
    }
    return {matches: matches, unmatched1: unmatched1, unmatched2: unmatched2};
}

// TODO: Implement compatibility matches
function constructMatchesCompatible (doc1, doc2) {
    var ret = constructMatchesEqual(doc1, doc2);
    // Construct compatible edges
    var newMatches = unweightedMatch();
}

// TODO: Implement flow field matches
function constructMatchesFlow (doc1, doc2, flowfield) {
}

function constructMatches (doc1, doc2) {
    return constructMatchesEqual(doc1, doc2);
}

function invertMatches(m) {
    var matches = [];
    m.matches.forEach(function(v) {
        matches.push({
            e1:v.e2,
            e2:v.e1,
            p1:v.p2,
            p2:v.p1
        });
    });
    return {matches: matches, unmatched1: m.unmatched2, unmatched2: m.unmatched1}
}
