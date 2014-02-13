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
