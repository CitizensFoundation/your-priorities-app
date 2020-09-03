import {LitElement, customElement, property} from 'lit-element';
import {XSelection} from './selection';

@customElement('lit-selector')
export class LitSelector extends LitElement {
    @property({type: String, attribute: 'activate-event'})
    activateEvent : string = 'tap';

    @property({type: String, attribute: 'selected-attribute'})
    selectedAttribute : string | null = null;

    @property({type: Number, reflect: true})
    selected :  number | string | null = null;

    _selection: XSelection<Node> = new XSelection((item, isSelected) => this.applySelection(item, isSelected));

    _items: Array<Node> = [];

    get items(): Array<Node> {
        return this._items;
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('slotchange', event => {
            event.stopPropagation();
            this.updateItems();
            this.dispatchEvent(new CustomEvent("selector-items-changed", { detail: {}, composed: true}));
          });

        this.addListener(this.activateEvent);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListener(this.activateEvent);
    }

    attributeChangedCallback(name : string, oldval : any, newval : any) {
        super.attributeChangedCallback(name, oldval, newval);
        switch (name) {
            case 'selected': {
                this.updateSelected();
                break;
            }
        }
    }

    applySelection(item: Node, isSelected: boolean) {
        if (this.selectedAttribute && item instanceof Element) {
            if (isSelected != (item as Element).hasAttribute(this.selectedAttribute))
                (item as Element).toggleAttribute(this.selectedAttribute);
        }
    }

    updateItems() {
        var slotElement = this.querySelector("slot");
        this._items = slotElement?.assignedNodes() ?? [];
    }

    addListener(eventName : string) {
        this.addEventListener(eventName, (event) => this.activateHandler(event));
    }

    removeListener(eventName : string) {
        this.removeEventListener(eventName, (event) => this.activateHandler(event));
    }

    activateHandler(event : Event) {
        var t = event.target as Node;
        var items = this.items;
        while (t && t != this) {
            var i = items.indexOf(t);
            if (i >= 0) {
                var value = this.indexToValue(i);
                this.itemActivate(value, t);
                return;
            }
            // @ts-ignore
            t = t.parentNode;
        }
    }

    itemActivate(value: any, item: any) {
        if (this.dispatchEvent(new CustomEvent('selector-item-activate', { detail: {selected: value, item: item}, composed: true, cancelable: true})))
            this.select(value);
    }

    select(value: any) {
        this.selected = value;
    }

    updateSelected() {
        this.selectSelected(this.selected);
    }

    selectSelected(selected: number | string | null) {
        if (!this._items)
            return;

        var item = this.valueToItem(this.selected);
        if (item) {
            this._selection.select(item);
        } else {
            this._selection.clear();
        }
    }

    valueToItem(value: number | string | null): Node {
        return (value == null) ? null : this._items[this.valueToIndex(value)];
    }

    valueToIndex(value: number | string): number {
        return Number(value);
    }

    indexToValue(index : number) : any {
        return index;
    }

    indexOf(item: Node): number {
        return this._items ? this._items.indexOf(item) : -1;
    }
}