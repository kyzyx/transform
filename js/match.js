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
        while (j < l2.length && l2[j].entity.value() < l1[i].entity.value()) {
            unmatched2.push({e:l2[j].entity, p:l2[j].pos});
            ++j;
        }
        if (j < l2.length && l1[i].entity.value() == l2[j].entity.value()) {
            if (i == 0 || l1[i].entity.value() != l1[i-1].entity.value()) {
                // Count number of equal elements in l2
                var nequal = 0;
                while (j+nequal < l2.length && l2[j+nequal].entity.value() == l1[i].entity.value()) {
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

