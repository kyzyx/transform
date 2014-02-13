var getCoords = function(e) {
    var x = 0;
    var y = 0;
    if (e.offsetParent) {
        do {
            x += e.offsetLeft;
            y += e.offsetTop;
        } while (e = e.offsetParent);
    }
    return [x,y];
}

var convertChar = function(elt) {
    var toRemove = [];
    var transformelts = [];
    var insertbefore = [];
    var children = elt.childNodes;
    for (var i = 0; i < children.length; ++i) {
        if (children[i].nodeType == 1) {
            convertChar(children[i]);
        } else if (children[i].nodeType == 3) {
            toRemove.push(children[i]);
            var nodetext = children[i].nodeValue;
            var s = "";
            for (var j = 0; j < nodetext.length; ++j) {
                if (/\s/.test(nodetext[j])) continue;
                var newelt = document.createElement('span');
                newelt.className = '_transform-entity';
                newelt.innerHTML = nodetext[j];
                transformelts.push(newelt);
                if (i != children.length-1) {
                    insertbefore.push(children[i+1]);
                } else {
                    insertbefore.push(false);
                }
            }
        }
    }
    for (var i = 0; i < transformelts.length; ++i) {
        if (insertbefore[i])
            elt.insertBefore(transformelts[i], insertbefore[i]);
        else
            elt.appendChild(transformelts[i]);

    }
    for (var i = 0; i < toRemove.length; ++i) elt.removeChild(toRemove[i]);
    return transformelts;
}
var parsePlain = function(elt) {
    var elts = convertChar(elt);
    var doc = Document();
    elts.forEach(function(v) {
        var e = Entity(v, v.innerHTML);
        doc.addEntity(e, getCoords(v));
    });
    return doc;
}
