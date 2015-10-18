PolymerExpressions.prototype.orderBy = function (array, columnsToOrderBy, reverse) {
    if (!Array.isArray(array)) {
        return array;
    }
    if (!columnsToOrderBy) {
        return array;
    }
    if (typeof columnsToOrderBy === 'string') {
        columnsToOrderBy = [columnsToOrderBy];
    }

    // on a column-by-column basis, determine if descending order is desired
    var reverseSortValues = [];
    columnsToOrderBy.forEach(function (element, index) {
        if (element[0] == '-') {
            columnsToOrderBy[index] = element.substr(1);
            reverseSortValues.push(true);
        } else {
            reverseSortValues.push(false);
        }
    });

    // temporary holder of position and sort-values
    var map = array.map(function (element, index) {
        var sortValues = columnsToOrderBy.map(function (key) {
            if (typeof element[key] === 'string') {
                return element[key].toLowerCase();
            }

            return element[key];
        });

        return {
            index: index,
            sortValues: sortValues
        };
    });

    // sorting the map containing the reduced values
    map.sort(function (a, b) {
        var length = a.sortValues.length;

        for (var i = 0; i < length; i++) {
            if (reverseSortValues[i] === false) {
                if (a.sortValues[i] < b.sortValues[i])
                    return -1;
                else if (a.sortValues[i] > b.sortValues[i])
                    return 1;
            } else {
                if (a.sortValues[i] > b.sortValues[i])
                    return -1;
                else if (a.sortValues[i] < b.sortValues[i])
                    return 1;
            }
        }

        return 0;
    });

    if (reverse === true) {
        map.reverse();
    }

    // container for the resulting order
    var result = map.map(function (element) {
        return array[element.index];
    });

    return result;
};