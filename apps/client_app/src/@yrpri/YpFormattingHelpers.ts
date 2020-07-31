export class YpFormattingHelpers {
  static number(value: number): string {
    if (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "0";
    }
  }

  static removeClass(element: HTMLElement | undefined | null, classToRemove: string) {
    let newClassName = "";
    if (element) {
      const classes = element.className.split(" ");
      for(let i = 0; i < classes.length; i++) {
        if(classes[i] !== classToRemove) {
          newClassName += classes[i] + " ";
        }
      }
      element.className = newClassName;
    } else {
      console.error("Trying to remove class from a non exisisting element");
    }
  }
}