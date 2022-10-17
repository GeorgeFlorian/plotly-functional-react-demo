import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

export function ScatterPlot() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      showlegend: false,
      autosize: true,
    },
    config: { responsive: true },
  });

  useEffect(() => {
    const getCSV = async () => {
      function unpack(rows, key) {
        return rows.map(function (row) {
          return parseFloat(row[key]);
        });
      }

      const csvRows = await d3.csv(
        'https://raw.githubusercontent.com/plotly/datasets/master/normal-clusters.csv'
      );

      const x0 = unpack(csvRows, 'x0');
      const x1 = unpack(csvRows, 'x1');
      const x2 = unpack(csvRows, 'x2');
      const y0 = unpack(csvRows, 'y0');
      const y1 = unpack(csvRows, 'y1');
      const y2 = unpack(csvRows, 'y2');

      const cluster0 = {
        type: 'circle',
        xref: 'x',
        yref: 'y',
        x0: Math.min(...x0),
        y0: Math.min(...y0),
        x1: Math.max(...x0),
        y1: Math.max(...y0),
        opacity: 0.25,
        line: { color: '#835AF1' },
        fillcolor: '#835AF1',
      };

      const cluster1 = {
        type: 'circle',
        xref: 'x',
        yref: 'y',
        x0: Math.min(...x1),
        y0: Math.min(...y1),
        x1: Math.max(...x1),
        y1: Math.max(...y1),
        opacity: 0.25,
        line: { color: '#7FA6EE' },
        fillcolor: '#7FA6EE',
      };

      const cluster2 = {
        type: 'circle',
        xref: 'x',
        yref: 'y',
        x0: Math.min(...x2),
        y0: Math.min(...y2),
        x1: Math.max(...x2),
        y1: Math.max(...y2),
        opacity: 0.25,
        line: { color: '#B8F7D4' },
        fillcolor: '#B8F7D4',
      };

      // The relayout method should be used when modifying the layout attributes of the graph.
      const updateMenus = [
        {
          buttons: [
            {
              args: ['shapes', []],
              label: 'None',
              method: 'relayout',
            },
            {
              args: ['shapes', [cluster0]],
              label: 'Cluster 0',
              method: 'relayout',
            },
            {
              args: ['shapes', [cluster1]],
              label: 'Cluster 1',
              method: 'relayout',
            },
            {
              args: ['shapes', [cluster2]],
              label: 'Cluster 2',
              method: 'relayout',
            },
            {
              args: ['shapes', [cluster0, cluster1, cluster2]],
              label: 'All',
              method: 'relayout',
            },
          ],
          direction: 'left',
          pad: { r: 10, t: 10 },
          showactive: true,
          type: 'buttons',
          x: 0.1,
          xanchor: 'left',
          y: 1.2,
          yanchor: 'top',
        },
      ];

      setChart((prevState) => ({
        ...prevState,
        data: [
          {
            x: x0,
            y: y0,
            mode: 'markers',
            marker: { color: '#835AF1' },
          },
          {
            x: x1,
            y: y1,
            mode: 'markers',
            marker: { color: '#7FA6EE' },
          },
          {
            x: x2,
            y: y2,
            mode: 'markers',
            marker: { color: '#B8F7D4' },
          },
        ],
        layout: {
          ...prevState.layout,
          updatemenus: updateMenus,
        },
      }));
    };

    getCSV();
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
