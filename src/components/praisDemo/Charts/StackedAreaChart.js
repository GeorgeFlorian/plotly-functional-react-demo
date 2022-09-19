import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { stackedAreaChart } from '../../../helpers/getData';

export function StackedAreaChart() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      showlegend: true,
      autosize: true,
      height: 800,
      margin: { pad: 10 },
      // plot_bgcolor: '#c7c7c7',
      // paper_bgcolor: '#c7c7c7',
    },
    frames: [],
    config: { responive: true },
  });

  useEffect(() => {
    const plot = stackedAreaChart('CAN');

    setChart((prevState) => ({
      data: [...plot.data],
      layout: { ...prevState.layout, ...plot.layout },
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
