import { dia, shapes, util, V } from "@joint/core";
import { PsServerApi } from "./PsServerApi";
const api = new PsServerApi();
export class AgentsShapeView extends dia.ElementView {
    constructor() {
        super(...arguments);
        this.observer = null;
        this.updateNodePosition = util.debounce(() => {
            const nodeType = this.model.attributes.nodeType;
            const nodeId = nodeType === "agent"
                ? this.model.attributes.agentId
                : this.model.attributes.connectorId;
            const position = this.model.position();
            api.updateNodeConfiguration(this.model.attributes.groupId, nodeType, nodeId, {
                graphPosX: position.x,
                graphPosY: position.y,
            });
        }, 500);
    }
    remove() {
        if (this.observer) {
            this.observer.disconnect();
        }
        super.remove();
        return this;
    }
    render() {
        super.render();
        const htmlMarkup = this.model.get("markup");
        //TODO: Make TS work here
        const nodeType = this.model.attributes.nodeType;
        let foreignObjectWidth = 200;
        let foreignObjectHeight = 300;
        if (nodeType === "connector") {
            foreignObjectWidth = 140;
            foreignObjectHeight = 180;
        }
        // Create a foreignObject with a set size and style
        const foreignObject = V("foreignObject", {
            width: foreignObjectWidth,
            height: foreignObjectHeight,
            style: "overflow: visible; display: block;",
        }).node;
        // Append the foreignObject to this.el
        V(this.el).append(foreignObject);
        // Defer the addition of the inner div with the HTML content
        setTimeout(() => {
            const div = document.createElement("div");
            div.setAttribute("class", "html-element");
            div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
            if (nodeType === "agent") {
                div.innerHTML = `<ps-agent-node
          agentId="${this.model.attributes.agentId}"
          groupId="${this.model.attributes.groupId}"
        >
     </ps-agent-node>`;
                div.className = "agentContainer";
                this.setupRunningObserver(div);
            }
            else {
                div.innerHTML = `<ps-connector-node
          connectorId="${this.model.attributes.connectorId}"
          groupId="${this.model.attributes.groupId}"
          agentName="${this.model.attributes.agentName}"
        >
      </ps-connector-node>`;
                div.className = "connectorContainer";
            }
            // Append the div to the foreignObject
            foreignObject.appendChild(div);
            // Force layout recalculation and repaint
            foreignObject.getBoundingClientRect();
        }, 0); // A timeout of 0 ms defers the execution until the browser has finished other processing
        // Add event listener for position changes
        this.listenTo(this.model, "change:position", this.updateNodePosition);
        this.update();
        return this;
    }
    setupRunningObserver(div) {
        const agentNode = div.querySelector('ps-agent-node');
        if (agentNode) {
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'running') {
                        const isRunning = agentNode.hasAttribute('running');
                        if (isRunning) {
                            div.classList.add('agentContainerRunning');
                        }
                        else {
                            div.classList.remove('agentContainerRunning');
                        }
                    }
                });
            });
            this.observer.observe(agentNode, { attributes: true, attributeFilter: ['running'] });
        }
    }
}
export class AgentShape extends shapes.standard.Rectangle {
    constructor() {
        super(...arguments);
        this.view = AgentsShapeView;
    }
    defaults() {
        return util.deepSupplement({
            type: "html.AgentShape",
            attrs: {},
            markup: "<div></div>",
        }, shapes.standard.Rectangle.prototype.defaults);
    }
}
//# sourceMappingURL=ps-agent-shape.js.map