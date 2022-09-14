import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import JSON_DATA from '../../data/pieChart.json';

export function PieChart() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      showlegend: true,
      autosize: true,
    },
    frames: [],
    config: { responive: true },
  });

  useEffect(() => {
    setChart((prevState) => ({
      ...prevState,
      ...JSON_DATA,
      layout: { ...prevState.layout, ...JSON_DATA.layout },
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
