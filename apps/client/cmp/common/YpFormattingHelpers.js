export class YpFormattingHelpers {
    static number(value) {
        if (value) {
            return value.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        else {
            return "0";
        }
    }
    static removeClass(element, classToRemove) {
        let newClassName = "";
        if (element) {
            const classes = element.className.split(" ");
            for (let i = 0; i < classes.length; i++) {
                if (classes[i] !== classToRemove) {
                    newClassName += classes[i] + " ";
                }
            }
            element.className = newClassName;
        }
        else {
            console.error("Trying to remove class from a non exisisting element");
        }
    }
    static truncate(input, length, killwords = undefined, end = undefined) {
        length = length || 255;
        if (input.length <= length)
            return input;
        if (killwords) {
            input = input.substring(0, length);
        }
        else {
            let idx = input.lastIndexOf(' ', length);
            if (idx === -1) {
                idx = length;
            }
            input = input.substring(0, idx);
        }
        input += (end !== undefined && end !== null) ? end : '...';
        return input;
    }
    static trim(input) {
        return input.replace(/^\s*|\s*$/g, '');
    }
}
//# sourceMappingURL=YpFormattingHelpers.js.map