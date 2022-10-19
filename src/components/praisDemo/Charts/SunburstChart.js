import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { createSunburstChart } from '../../../helpers/getData';

export function SunburstChart() {
  const [chart, setChart] = useState({
    data: [
      {
        type: 'sunburst',
        sort: false,
        hovertemplate: '%{label}<br />%{value}% <extra></extra>',
        marker: {
          line: { width: 2 },
          cmin: 0,
          cmax: 100,
          colorscale: [
            [0, '#19c8aa'],
            [0.1, '#17ce4a'],
            [0.2, '#8cd914'],
            [0.3, '#dcdd13'],
            [0.4, '#dfc813'],
            [0.5, '#e0af12'],
            [0.6, '#e29712'],
            [0.7, '#e37e11'],
            [0.8, '#e56411'],
            [0.9, '#e64a11'],
            [1, '#e92210'],
          ],
          colorbar: {
            title: 'Drought %',
            ticksuffix: '%',
            showticksuffix: 'last',
          },
        },
        branchvalues: 'relative',
        // maxdepth: 2,
      },
    ],
    layout: {
      title: {
        text: 'Baseline Period (Year 2015)',
        x: 0.5,
        y: 1,
      },
      showlegend: true,
      legend: {
        x: 0,
        y: -0.2,
        orientation: 'h',
      },
      autosize: true,
      margin: { l: 0, r: 0, b: 0, t: 50 },
      height: 800,
    },
    config: { responsive: true },
  });

  useEffect(() => {
    const baseline = createSunburstChart('baseline_period', '2015');
    const reporting = createSunburstChart('reporting_period', '2019');

    const layout = {
      sliders: [
        {
          x: 0.05,
          pad: { b: 10 },
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
                  labels: [baseline.labels],
                  parents: [baseline.parents],
                  ids: [baseline.ids],
                  values: [baseline.values],
                },
                { title: 'Baseline Period (Year 2015)', height: 800 },
              ],
            },
            {
              label: 'Reporting',
              method: 'update',
              args: [
                {
                  labels: [reporting.labels],
                  parents: [reporting.parents],
                  ids: [reporting.ids],
                  values: [reporting.values],
                },
                { title: 'Reporting Period (Year 2019)', height: 800 },
              ],
            },
          ],
        },
      ],
    };

    setChart((prevState) => ({
      data: [{ ...prevState.data[0], ...baseline }],
      layout: { ...prevState.layout, ...layout },
    }));
  }, []);

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
