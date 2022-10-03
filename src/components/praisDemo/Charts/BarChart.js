import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

import { createBarChart } from '../../../helpers/getData';

export function BarChart() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      title: 'Baseline Period (Year 2015)',
      showlegend: true,
      legend: {
        x: 0,
        y: -0.4,
        orientation: 'h',
      },
      autosize: true,
      barmode: 'stack',
      // barnorm: 'percent',
      xaxis: { automargin: true, tickangle: 0 },
    },
    frames: [],
    config: { responive: true },
  });

  useEffect(() => {
    // get Percentage of degraded land in each region
    // Percentage non-degraded land = 100 - Percentage of degraded land in each region
    const myData = createBarChart();
    console.log(myData);

    const degradedLand = {
      x: [],
      y: [],
      name: 'Percentage of degraded land',
      type: 'bar',
      marker: { color: '#000' },
    };
    const nonDegradedLand = {
      x: [],
      y: [],
      name: 'Percentage of non-degraded land',
      type: 'bar',
      marker: { color: '#FE7100' },
    };
    myData.forEach((region) => {
      degradedLand.x.push(region.name.replaceAll(' ', '<br>'));
      degradedLand.y.push(Number(region.percentage));
      nonDegradedLand.x.push(region.name.replaceAll(' ', '<br>'));
      nonDegradedLand.y.push(100 - Number(region.percentage));
    });

    // console.log(data);

    setChart((prevState) => ({
      data: [nonDegradedLand, degradedLand],
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
