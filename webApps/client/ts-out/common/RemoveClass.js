export const removeClass = (element, classToRemove) => {
    let newClassName = "";
    const classes = element.className.split(" ");
    for (let i = 0; i < classes.length; i++) {
        if (classes[i] !== classToRemove) {
            newClassName += classes[i] + " ";
        }
    }
    element.className = newClassName;
};
//# sourceMappingURL=RemoveClass.js.map