import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

import { landTypes } from '../../../helpers/fooData';
import { doSomething } from '../../../helpers/getData';

export function BarChart() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      showlegend: true,
      legend: {
        x: 0,
        y: -0.2,
        orientation: 'h',
      },
      autosize: true,
      barmode: 'stack',
    },
    frames: [],
    config: { responive: true },
  });

  useEffect(() => {
    const data = landTypes.map((land) => {
      return {
        x: land['region'],
        y: land['land-area'],
        name: land['type'],
        type: 'bar',
        marker: {
          color: land['type'] === 'Non Degraded Land' ? '#FE7100' : '#000',
        },
      };
    });

    // console.log(data);

    setChart((prevState) => ({
      data: [...data],
      layout: { ...prevState.layout },
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
