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
    const droughtType = {
      non_drought: { name: 'Non Drought', color: '#a6ee4a' },
      mild_drought: { name: 'Mild Drought', color: '#eee44a' },
      moderate_drought: { name: 'Moderate Drought', color: '#f88502' },
      severe_drought: { name: 'Severe Drought', color: '#f85500' },
      extreme_drought: { name: 'Extreme Drought', color: '#c42a02' },
    };

    const region = 'Central Asia (M49) and Southern Asia (MDG=M49)';

    const { data, name } = stackedAreaChartEndpoint(region);

    const plotData = Object.keys(droughtType).map((drought) => {
      // filter region data by drought class
      const droughtClass = data.filter(
        (el) => el.class === droughtType[drought].name
      );

      return {
        x: droughtClass.map((ele) => ele.year),
        y: droughtClass.map((ele) => Number(ele.percentage * 100).toFixed(2)),
        stackgroup: 'one',
        // setting norm to percent normalizes the values relative to 100%
        // but the values do not add up to 100
        // so the percentages get altered so that they add up to 100
        groupnorm: 'percent',
        name: droughtType[drought].name,
        fillcolor: droughtType[drought].color,

        text: droughtClass.map((ele) => ele.class),
        line: { color: '#fff' },
        textfont: { color: '#000' },
        hovertemplate: '%{text}<br>%{x} - %{y:.2f}% <extra></extra>',
      };
    });

    const layout = { title: name };

    setChart((prevState) => ({
      data: [...plotData],
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
