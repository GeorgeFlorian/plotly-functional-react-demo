import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { stackedAreaChartEndpoint } from '../../../helpers/getData';

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
    config: { responsive: true },
  });

  useEffect(() => {
    const { data, title } = stackedAreaChartEndpoint();
    console.log('plot data', data);

    const layout = { title: title };

    setChart((prevState) => ({
      data: [...data],
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
