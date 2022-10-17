import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

const button_layer_1_height = 1.12;
const button_layer_2_height = 1.0;
const annotation_offset = 0.04;

export function SurfacePlot() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      showlegend: false,
      autosize: true,
    },
    config: { responive: true },
  });

  useEffect(() => {
    const getCSV = async () => {
      function unpack(rows, key) {
        return rows.map(function (row) {
          return parseFloat(row[key]);
        });
      }

      const csvRows = await d3.csv(
        'https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv'
      );

      const z_data = [];

      for (let i = 0; i < 24; i++) {
        z_data.push(unpack(csvRows, i));
      }

      const data = [
        {
          z: z_data,
          type: 'surface',
          colorscale: 'Viridis',
          reversescale: false,
        },
      ];
      // The restyle method should be used when modifying the data and data attributes of the graph
      const updateMenus = [
        {
          buttons: [
            {
              args: ['type', 'surface'],
              label: '3D Surface',
              method: 'restyle',
            },
            { args: ['type', 'heatmap'], label: 'Heatmap', method: 'restyle' },
            { args: ['type', 'contour'], label: 'Contour', method: 'restyle' },
          ],
          direction: 'left',
          pad: { r: 10, t: 10 },
          showactive: true,
          type: 'buttons',
          x: 0.15,
          xanchor: 'left',
          y: button_layer_2_height,
          yanchor: 'top',
        },
        {
          buttons: [
            {
              args: ['reversescale', false],
              label: 'Undo Reverse',
              method: 'restyle',
            },
            {
              args: ['reversescale', true],
              label: 'Reverse',
              method: 'restyle',
            },
          ],
          direction: 'left',
          pad: { r: 10, t: 10 },
          showactive: false,
          type: 'buttons',
          x: 0.56,
          xanchor: 'left',
          y: button_layer_2_height,
          yanchor: 'top',
        },
        {
          buttons: [
            {
              args: [{ 'contours.showlines': false }],
              label: 'Hide lines',
              method: 'restyle',
            },
            {
              args: [{ 'contours.showlines': true }],
              label: 'Show lines',
              method: 'restyle',
            },
          ],
          direction: 'left',
          pad: { r: 10, t: 10 },
          showactive: true,
          type: 'buttons',
          x: 0.78,
          xanchor: 'left',
          y: button_layer_2_height,
          yanchor: 'top',
        },
        {
          buttons: [
            {
              args: ['colorscale', 'Viridis'],
              label: 'Viridis',
              method: 'restyle',
            },
            {
              args: ['colorscale', 'Electric'],
              label: 'Electric',
              method: 'restyle',
            },
            {
              args: ['colorscale', 'Earth'],
              label: 'Earth',
              method: 'restyle',
            },
            { args: ['colorscale', 'Hot'], label: 'Hot', method: 'restyle' },
            { args: ['colorscale', 'Jet'], label: 'Jet', method: 'restyle' },
            {
              args: ['colorscale', 'Portland'],
              label: 'Portland',
              method: 'restyle',
            },
            {
              args: ['colorscale', 'Rainbow'],
              label: 'Rainbow',
              method: 'restyle',
            },
            {
              args: ['colorscale', 'Blackbody'],
              label: 'Blackbody',
              method: 'restyle',
            },
            {
              args: ['colorscale', 'Cividis'],
              label: 'Cividis',
              method: 'restyle',
            },
          ],
          direction: 'left',
          pad: { r: 10, t: 10 },
          showactive: true,
          type: 'buttons',
          x: 0.15,
          xanchor: 'left',
          y: button_layer_1_height,
          yanchor: 'top',
        },
      ];

      const annotations = [
        {
          text: 'Colorscale:',
          x: 0,
          y: button_layer_1_height - annotation_offset,
          yref: 'paper',
          align: 'left',
          showarrow: false,
          xanchor: 'left',
        },
        {
          text: 'Trace type:',
          x: 0,
          y: button_layer_2_height - annotation_offset,
          yref: 'paper',
          align: 'left',
          showarrow: false,
          xanchor: 'left',
        },
      ];

      const layout = {
        margin: { t: 30, b: 0, l: 0, r: 0 },
        updatemenus: updateMenus,
        annotations: annotations,
        scene: {
          xaxis: {
            gridcolor: 'rgb(255, 255, 255)',
            zerolinecolor: 'rgb(255, 255, 255)',
            showbackground: true,
            backgroundcolor: 'rgb(230, 230,230)',
          },
          yaxis: {
            gridcolor: 'rgb(255, 255, 255)',
            zerolinecolor: 'rgb(255, 255, 255)',
            showbackground: true,
            backgroundcolor: 'rgb(230, 230, 230)',
          },
          zaxis: {
            gridcolor: 'rgb(255, 255, 255)',
            zerolinecolor: 'rgb(255, 255, 255)',
            showbackground: true,
            backgroundcolor: 'rgb(230, 230,230)',
          },
          aspectratio: { x: 1, y: 1, z: 0.7 },
          aspectmode: 'manual',
        },
      };

      setChart((prevState) => ({
        ...prevState,
        data: data,
        layout: { ...prevState.layout, ...layout },
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
