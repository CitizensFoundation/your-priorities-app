export class XSelection<TItem> {
    multi : boolean;
    selection: Array<TItem>;
    selectCallback: (item: TItem, isSelected: boolean) => void;

    constructor(selectCallback?: (item: TItem, isSelected: boolean) => void) {
        this.multi = false;
        this.selection = [];
        this.selectCallback = selectCallback;
    }

    get(): Array<TItem> | TItem {
        return this.multi ? this.selection.slice() : this.selection[0];
    }

    clear(excludes?: Array<TItem>) {
        this.selection.slice().forEach(item => {
            if (!excludes || excludes.indexOf(item) < 0)
                this.setItemSelected(item, false);
        })
    }

    isSelected(item: TItem) : boolean {
        return this.selection.indexOf(item) >= 0;
    }

    setItemSelected(item: TItem, isSelected: boolean) {
        if (item == null || isSelected == this.isSelected(item))
            return;

        if (isSelected) {
            this.selection.push(item);
        } else {
            var i = this.selection.indexOf(item);
            if (i >= 0) {
                this.selection.splice(i, 1);
            }
        }

        if (this.selectCallback) {
            this.selectCallback(item, isSelected);
        }
    }

    select(item: TItem) {
        if (this.multi) {
          this.toggle(item);
        } else if (this.get() !== item) {
          this.setItemSelected(this.get() as TItem, false);
          this.setItemSelected(item, true);
        }
    }

    toggle(item: TItem) {
        this.setItemSelected(item, !this.isSelected(item));
    }
}