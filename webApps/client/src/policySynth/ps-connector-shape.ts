import { dia, shapes, util, V } from '@joint/core';
import { AgentsShapeView } from './ps-agent-shape';

export class ConnectorShape extends shapes.standard.Rectangle {
  override defaults() {
    return util.deepSupplement(
      {
        type: 'html.Connectorshape',
        attrs: {},
        markup: '<div></div>',
      },
      shapes.standard.Rectangle.prototype.defaults
    );
  }

  view = AgentsShapeView;
}
