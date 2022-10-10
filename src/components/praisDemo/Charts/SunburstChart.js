import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { createSunburstChart } from '../../../helpers/getData';

const DEFAULT_DATA = [
  {
    title: 'Baseline Period (Year 2015)',
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
  },
];

export function SunburstChart() {
  const [chart, setChart] = useState({
    data: DEFAULT_DATA,
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
      margin: { l: 0, r: 0, b: 0, t: 0 },
      width: 900,
      height: 800,
    },
    frames: [],
    config: { responive: true },
  });

  useEffect(() => {
    const data = createSunburstChart();

    setChart((prevState) => ({
      data: [{ ...DEFAULT_DATA[0], ...data }],
      layout: { ...prevState.layout },
    }));
  }, []);

  const onUpdatePlot = () => {
    console.log('Plot Updated');
  };

  return (
    <>
      <Plot
        data={chart.data}
        layout={chart.layout}
        config={chart.config}
        style={{ width: '100%', height: '100%' }}
        onUpdate={onUpdatePlot}
        useResizeHandler
      />
    </>
  );
}
