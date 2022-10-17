import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const JSON_DATA = {
  data: [
    {
      x: ['Giraffes', 'Orangutans', 'Monkeys'],
      y: [20, 14, 23],
      text: [
        '4.17 below the mean',
        '4.17 below the mean',
        '0.17 below the mean',
        '0.17 below the mean',
        '0.83 above the mean',
        '7.83 above the mean',
      ],
      type: 'bar',
      marker: { color: '#ab63fa' },
      name: 'Bucharest Zoo',
      showlegend: true,
    },
    {
      x: ['Giraffes', 'Orangutans', 'Monkeys'],
      y: [12, 18, 29],
      text: ['12', '18', '29'],
      type: 'bar',
      marker: { color: '#19d3f3' },
      name: 'Cluj Zoo',
    },
  ],
  layout: {
    plotBackground: '#f3f6fa',
    margin: { t: 30, r: 0, l: 20, b: 30 },
    title: '# of animals Zoos',
  },
};

export function BarChart() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      showlegend: true,
      autosize: true,
    },
    config: { responsive: true },
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
