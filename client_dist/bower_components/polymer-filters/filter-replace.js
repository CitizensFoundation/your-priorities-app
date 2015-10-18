PolymerExpressions.prototype.replace = function (str, old, new_, maxCount) {
    var res = str;
    var last = res;
    var count = 1;
    res = res.replace(old, new_);

    while (last != res) {
        if (count >= maxCount) {
            break;
        }

        last = res;
        res = res.replace(old, new_);
        count++;
    }

    return res;
};