import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

import { barChartEndpoint } from '../../../helpers/getData';

export function BarChartRegions() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      title: 'Baseline Period (Year 2015)',
      showlegend: true,
      margin: { pad: 10 },
      autosize: true,
      barmode: 'stack',
      xaxis: { autorange: true, type: 'category', tickangle: 0 },
      yaxis: { autorange: true, type: 'linear' },
    },
    frames: [],
    config: { responive: true },
  });

  useEffect(() => {
    // get Percentage of degraded land in each region
    // Percentage non-degraded land = 100 - Percentage of degraded land in each region

    const baselinePeriodData = barChartEndpoint('baseline_period', '2015');
    const reportingPeriodData = barChartEndpoint('reporting_period', '2019');

    const degradedLandBaseline = {
      x: [],
      y: [],
      name: 'Percentage of<br>degraded land',
      type: 'bar',
      marker: { color: '#000' },
      hovertemplate: '%{x} - %{y:.2f}% <extra></extra>',
    };
    const nonDegradedLandBaseline = {
      x: [],
      y: [],
      name: 'Percentage of<br>non-degraded land',
      type: 'bar',
      marker: { color: '#FE7100' },
      hovertemplate: '%{x} - %{y:.2f}% <extra></extra>',
    };
    const degradedLandReporting = {
      x: [],
      y: [],
      name: 'Percentage of<br>degraded land',
      type: 'bar',
      marker: { color: '#000' },
      hovertemplate: '%{x} - %{y:.2f}% <extra></extra>',
    };
    const nonDegradedLandReporting = {
      x: [],
      y: [],
      name: 'Percentage of<br>non-degraded land',
      type: 'bar',
      marker: { color: '#FE7100' },
      hovertemplate: '%{x} - %{y:.2f}% <extra></extra>',
    };

    baselinePeriodData.regions.forEach((region) => {
      degradedLandBaseline.x.push(region.name.replaceAll(' ', '<br>'));
      degradedLandBaseline.y.push(Number(region.percentage));
      nonDegradedLandBaseline.x.push(region.name.replaceAll(' ', '<br>'));
      nonDegradedLandBaseline.y.push(100 - Number(region.percentage));
    });

    reportingPeriodData.regions.forEach((region) => {
      degradedLandReporting.x.push(region.name.replaceAll(' ', '<br>'));
      degradedLandReporting.y.push(Number(region.percentage));
      nonDegradedLandReporting.x.push(region.name.replaceAll(' ', '<br>'));
      nonDegradedLandReporting.y.push(100 - Number(region.percentage));
    });

    const layout = {
      sliders: [
        {
          y: -0.4,
          currentvalue: {
            xanchor: 'right',
            prefix: 'Period: ',
            font: {
              color: '#888',
              size: 20,
            },
          },
          steps: [
            {
              label: 'Baseline',
              method: 'update',
              args: [
                {
                  x: [nonDegradedLandBaseline.x, degradedLandBaseline.x],
                  y: [nonDegradedLandBaseline.y, degradedLandBaseline.y],
                  name: [
                    nonDegradedLandBaseline.name,
                    degradedLandBaseline.name,
                  ],
                  type: ['bar', 'bar'],
                  marker: [{ color: '#FE7100' }, { color: '#000' }],
                  hovertemplate: [
                    '%{x} - %{y:.2f}% <extra></extra>',
                    '%{x} - %{y:.2f}% <extra></extra>',
                  ],
                },
                { title: 'Baseline Period (2015)' },
              ],
            },
            {
              label: 'Reporting',
              method: 'update',
              args: [
                {
                  x: [nonDegradedLandReporting.x, degradedLandReporting.x],
                  y: [nonDegradedLandReporting.y, degradedLandReporting.y],
                  name: [
                    nonDegradedLandReporting.name,
                    degradedLandReporting.name,
                  ],
                  type: ['bar', 'bar'],
                  marker: [{ color: '#FE7100' }, { color: '#000' }],
                  hovertemplate: [
                    '%{x} - %{y:.2f}% <extra></extra>',
                    '%{x} - %{y:.2f}% <extra></extra>',
                  ],
                },
                { title: 'Reporting Period (2019)' },
              ],
            },
          ],
        },
      ],
    };

    setChart((prevState) => ({
      ...prevState,
      data: [nonDegradedLandBaseline, degradedLandBaseline],
      layout: { ...prevState.layout, ...layout },
    }));
  }, [setChart]);

  return (
    <Plot
      data={chart.data}
      layout={chart.layout}
      config={chart.config}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  );
}
