import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const JSON_DATA = {
  data: [
    {
      values: [16, 15, 12, 6, 5, 4, 42],
      labels: [
        'US',
        'China',
        'European Union',
        'Russian Federation',
        'Brazil',
        'India',
        'Rest of World',
      ],
      domain: { column: 0 },
      name: 'GHG Emissions',
      hoverinfo: 'label+percent+name',
      hole: 0.4,
      type: 'pie',
      insidetextorientation: 'radial',
    },
    {
      values: [27, 11, 25, 8, 1, 3, 25],
      labels: [
        'US',
        'China',
        'European Union',
        'Russian Federation',
        'Brazil',
        'India',
        'Rest of World',
      ],
      text: 'CO2',
      textposition: 'outside',
      domain: { column: 1 },
      name: 'CO2 Emissions',
      hoverinfo: 'label+percent+name',
      hole: 0.4,
      type: 'pie',
    },
  ],
  layout: {
    title: 'Global Emissions 1990-2011',
    annotations: [
      {
        font: {
          size: 20,
        },
        showarrow: false,
        text: 'GHG',
        x: 0.17,
        y: 0.5,
      },
      {
        font: {
          size: 20,
        },
        showarrow: false,
        text: 'CO2',
        x: 0.82,
        y: 0.5,
      },
    ],
    grid: { rows: 1, columns: 2 },
  },
};

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
