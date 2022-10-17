import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

import { barChartEndpoint } from '../../../helpers/getData';

const EXAMPLE_REGION = 'Northern America (M49) and Europe (M49)';

export function BarChartCountries() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      title: 'Baseline Period (Year 2015)',
      showlegend: true,
      margin: { pad: 10, l: 300 },
      autosize: true,
      barmode: 'stack',
      xaxis: { autorange: true, type: 'linear' },
      yaxis: {
        autorange: true,
        type: 'category',
        dtick: 1,
      },
      height: 1000,
      xanchor: 'center',
      bargap: 0.3,
    },
    frames: [],
    config: { responive: true },
  });

  useEffect(() => {
    // get Percentage of degraded land in each region
    // Percentage non-degraded land = 100 - Percentage of degraded land in each region

    const baselinePeriodData = barChartEndpoint('baseline_period', '2015');
    const reportingPeriodData = barChartEndpoint('reporting_period', '2019');

    const baselineCountries = baselinePeriodData.countries[EXAMPLE_REGION];
    const reportingCountries = reportingPeriodData.countries[EXAMPLE_REGION];

    const degradedLandBaseline = {
      x: [],
      y: [],
      name: 'Percentage of<br>degraded land',
      type: 'bar',
      marker: { color: '#000' },
      hovertemplate: '%{y} - %{x:.2f}% <extra></extra>',
      orientation: 'h',
    };
    const nonDegradedLandBaseline = {
      x: [],
      y: [],
      name: 'Percentage of<br>non-degraded land',
      type: 'bar',
      marker: { color: '#FE7100' },
      hovertemplate: '%{y} - %{x:.2f}% <extra></extra>',
      orientation: 'h',
    };

    const degradedLandReporting = {
      x: [],
      y: [],
      name: 'Percentage of<br>degraded land',
      type: 'bar',
      marker: { color: '#000' },
      hovertemplate: '%{y} - %{x:.2f}% <extra></extra>',
      orientation: 'h',
    };
    const nonDegradedLandReporting = {
      x: [],
      y: [],
      name: 'Percentage of<br>non-degraded land',
      type: 'bar',
      marker: { color: '#FE7100' },
      hovertemplate: '%{y} - %{x:.2f}% <extra></extra>',
      orientation: 'h',
    };

    baselineCountries.forEach((country) => {
      const percentage = Number(
        +country.degraded_area / +country.total_area
      ).toFixed(2);
      degradedLandBaseline.y.push(country.name);
      degradedLandBaseline.x.push(Number(percentage));
      nonDegradedLandBaseline.y.push(country.name);
      nonDegradedLandBaseline.x.push(100 - Number(percentage));
    });

    reportingCountries.forEach((country) => {
      const percentage = Number(
        +country.degraded_area / +country.total_area
      ).toFixed(2);
      degradedLandReporting.y.push(country.name);
      degradedLandReporting.x.push(Number(percentage));
      nonDegradedLandReporting.y.push(country.name);
      nonDegradedLandReporting.x.push(100 - Number(percentage));
    });

    const layout = {
      title: `Baseline Period (2015)<br>${EXAMPLE_REGION}`,
      sliders: [
        {
          y: -0.05,
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
                    '%{y} - %{x:.2f}% <extra></extra>',
                    '%{y} - %{x:.2f}% <extra></extra>',
                  ],
                },
                { title: `Baseline Period (2015)<br>${EXAMPLE_REGION}` },
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
                    '%{y} - %{x:.2f}% <extra></extra>',
                    '%{y} - %{x:.2f}% <extra></extra>',
                  ],
                },
                { title: `Reporting Period (2019)<br>${EXAMPLE_REGION}` },
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
