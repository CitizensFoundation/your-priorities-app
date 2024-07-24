import { shapes, util } from '@joint/core';
import { AgentsShapeView } from './ps-agent-shape';
export class ConnectorShape extends shapes.standard.Rectangle {
    constructor() {
        super(...arguments);
        this.view = AgentsShapeView;
    }
    defaults() {
        return util.deepSupplement({
            type: 'html.Connectorshape',
            attrs: {},
            markup: '<div></div>',
        }, shapes.standard.Rectangle.prototype.defaults);
    }
}
//# sourceMappingURL=ps-connector-shape.js.map