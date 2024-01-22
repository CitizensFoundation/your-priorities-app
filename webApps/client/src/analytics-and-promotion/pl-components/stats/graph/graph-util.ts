import { METRIC_LABELS, METRIC_FORMATTER } from './pl-visitors-graph.js';
import { parseUTCDate, formatMonthYYYY, formatDay } from '../../util/date.js';

interface GraphData {
  interval: string;
  labels: string[];
  // Additional properties can be added as required
}

interface TooltipModel {
  opacity: number;
  body?: { lines: string[] }[];
  dataPoints: { dataIndex: number; raw: number }[];
  // Additional properties can be added as required
}

interface CanvasElement extends HTMLElement {
  getBoundingClientRect: () => DOMRect;
}

export const dateFormatter = (interval: string, longForm: boolean = false) => {
  return function (isoDate: string, _index?: number, _ticks?: any): string | undefined {
    let date = parseUTCDate(isoDate);

    if (interval === 'month') {
      return formatMonthYYYY(date);
    } else if (interval === 'date') {
      return formatDay(date);
    } else if (interval === 'hour') {
      const parts = isoDate.split(/[^0-9]/);
      //@ts-ignore
      date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
      var hours = date.getHours(); // Not sure why getUTCHours doesn't work here
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return hours + ampm;
    } else if (interval === 'minute') {
      if (longForm) {
        const minutesAgo = Math.abs(parseInt(isoDate));
        return minutesAgo === 1 ? '1 minute ago' : minutesAgo + ' minutes ago';
      } else {
        return isoDate + 'm';
      }
    } else {
      return isoDate;
    }
  };
};

export const GraphTooltip = (
  graphData: GraphData,
  metric: string,
  mainCanvasElement: CanvasElement,
  tooltipElement: HTMLElement
) => {
  return (context: any) => {
    const tooltipModel: TooltipModel = context.tooltip;
    const offset: DOMRect = mainCanvasElement.getBoundingClientRect();

    // Tooltip Element
    let tooltipEl = tooltipElement;

    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      tooltipEl.style.display = 'none';
      tooltipEl.style.opacity = "0";
      document.body.appendChild(tooltipEl);
    }

    // Positioning for smaller screens
    if (tooltipEl && offset && window.innerWidth < 768) {
      tooltipEl.style.top = offset.y + offset.height + window.scrollY + 15 + 'px';
      tooltipEl.style.left = offset.x + 'px';
      tooltipEl.style.right = "";
      tooltipEl.style.opacity = "1";
    }

    // Stop if no tooltip showing
    if (tooltipModel.opacity === 0) {
      tooltipEl.style.display = 'none';
      return;
    }

    // Function to get the body content
    function getBody(bodyItem: { lines: string[] }) {
      return bodyItem.lines;
    }

    // Function to render the label
    function renderLabel(label: string, prev_label?: string) {
      const formattedLabel = dateFormatter(graphData.interval, true)(label);
      const prev_formattedLabel = prev_label ? dateFormatter(graphData.interval, true)(prev_label) : null;

      if (graphData.interval === 'month' || graphData.interval === 'date') {
        return prev_label ? prev_formattedLabel : formattedLabel;
      }

      if (graphData.interval === 'hour') {
        return prev_label
          ? `${dateFormatter("date", true)(prev_label)}, ${dateFormatter(graphData.interval, true)(prev_label)}`
          : `${dateFormatter("date", true)(label)}, ${formattedLabel}`;
      }

      return prev_label ? prev_formattedLabel : formattedLabel;
    }

    // Set Tooltip Body
    if (tooltipModel.body) {
      var bodyLines = tooltipModel.body.map(getBody);

      // Remove duplicated line on overlap between dashed and normal
      if (bodyLines.length === 3) {
        bodyLines[1] = [];
      }

      const data = tooltipModel.dataPoints[0];
      const label = graphData.labels[data.dataIndex];
      const point = data.raw || 0;

      let innerHtml = `
        <div class='text-gray-100 flex flex-col'>
          <div class='flex justify-between items-center'>
            <span class='font-bold mr-4 text-lg'>${METRIC_LABELS[metric]}</span>
          </div>
          <div class='flex flex-col'>
            <div class='flex flex-row justify-between items-center'>
              <span class='flex items-center mr-4'>
                <div class='w-3 h-3 mr-1 rounded-full' style='background-color: rgba(101,116,205)'></div>
                <span>${renderLabel(label)}</span>
              </span>
              <span>${METRIC_FORMATTER[metric](point)}</span>
            </div>
          </div>
          <span class='font-bold text-'>${graphData.interval === 'month' ? 'Click to view month' : graphData.interval === 'date' ? 'Click to view day' : ''}</span>
        </div>
      `;

      tooltipEl.innerHTML = innerHtml;
    }

    tooltipEl.style.display = "";
  };
};

export const buildDataSet = (
  plot: Array<number | undefined>,
  present_index: number | null,
  ctx: CanvasRenderingContext2D,
  label: string,
  isPrevious: boolean
) => {
  var gradient = ctx.createLinearGradient(0, 0, 0, 300);
  var prev_gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(101,116,205, 0.2)');
  gradient.addColorStop(1, 'rgba(101,116,205, 0)');
  prev_gradient.addColorStop(0, 'rgba(101,116,205, 0.075)');
  prev_gradient.addColorStop(1, 'rgba(101,116,205, 0)');

  if (!isPrevious) {
    if (present_index !== null) {
      var dashedPart = plot.slice(present_index - 1, present_index + 1);
      var dashedPlot = (new Array(present_index - 1)).fill(undefined).concat(dashedPart);
      const _plot = [...plot];
      for (var i = present_index; i < _plot.length; i++) {
        _plot[i] = undefined;
      }

      return [{
        label,
        data: _plot,
        borderWidth: 3,
        borderColor: 'rgba(101,116,205)',
        pointBackgroundColor: 'rgba(101,116,205)',
        pointHoverBackgroundColor: 'rgba(71, 87, 193)',
        pointBorderColor: 'transparent',
        pointHoverRadius: 4,
        backgroundColor: gradient,
        fill: true,
      },
      {
        label,
        data: dashedPlot,
        borderWidth: 3,
        borderDash: [3, 3],
        borderColor: 'rgba(101,116,205)',
        pointHoverBackgroundColor: 'rgba(71, 87, 193)',
        pointBorderColor: 'transparent',
        pointHoverRadius: 4,
        backgroundColor: gradient,
        fill: true,
      }];
    } else {
      return [{
        label,
        data: plot,
        borderWidth: 3,
        borderColor: 'rgba(101,116,205)',
        pointHoverBackgroundColor: 'rgba(71, 87, 193)',
        pointBorderColor: 'transparent',
        pointHoverRadius: 4,
        backgroundColor: gradient,
        fill: true,
      }];
    }
  } else {
    return [{
      label,
      data: plot,
      borderWidth: 2,
      borderColor: 'rgba(166,187,210,0.5)',
      pointHoverBackgroundColor: 'rgba(166,187,210,0.8)',
      pointBorderColor: 'transparent',
      pointHoverBorderColor: 'transparent',
      pointHoverRadius: 4,
      backgroundColor: prev_gradient,
      fill: true,
    }];
  }
};
