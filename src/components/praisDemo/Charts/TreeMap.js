import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const DEFAULT_STATE = {
  data: [
    {
      type: 'treemap',
      sort: false,
      labels: [
        'Non Drought',
        'WES',
        'AAP',
        'CEE',
        'LAC',
        'AFR',

        'FRA',
        'AUS',
        'CAN',
        'USA',
        'CHN',
        'IND',
        'KAZ',
        'SAU',
        'IDN',
        'RUS',
        'UKR',
        'BRA',
        'ARG',
        'MEX',
        'PER',
        'COL',
        'DZA',
        'COD',
        'SDN',
        'LBY',
        'TCD',
      ],
      parents: [
        '',
        'Non Drought',
        'Non Drought',
        'Non Drought',
        'Non Drought',
        'Non Drought',
        'WES',
        'WES',
        'WES',
        'WES',
        'AAP',
        'AAP',
        'AAP',
        'AAP',
        'AAP',
        'CEE',
        'CEE',
        'LAC',
        'LAC',
        'LAC',
        'LAC',
        'LAC',
        'AFR',
        'AFR',
        'AFR',
        'AFR',
        'AFR',
      ],
      values: [
        25, 4, 5, 6, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1,
      ],
      textinfo: 'label+value+percent parent+percent entry',
      leaf: { opacity: 0.5 },
      marker: {
        line: { width: 2 },
        cmin: 0,
        cmax: 100,
        colorscale: [
          [0, '#19c8aa'],
          [0.1, '#17ce4a'],
          [0.2, '#8cd914'],
          [0.3, '#dcdd13'],
          [0.4, '#dfc813'],
          [0.5, '#e0af12'],
          [0.6, '#e29712'],
          [0.7, '#e37e11'],
          [0.8, '#e56411'],
          [0.9, '#e64a11'],
          [1, '#e92210'],
        ],
        colorbar: {
          title: 'Some rate',
          ticksuffix: '%',
          showticksuffix: 'last',
        },
      },
      branchvalues: 'total',
    },
  ],
  layout: {
    showlegend: true,
    legend: {
      x: 0,
      y: -0.2,
      orientation: 'h',
    },
    autosize: true,
    margin: { l: 0, r: 0, b: 0, t: 0 },
  },
  frames: [],
  config: { responive: true },
};

// second plot with repeated labels
// Regions -> Drought class -> countries

export function TreeMap() {
  const [chart, setChart] = useState(DEFAULT_STATE);

  return (
    <>
      <Plot
        data={chart.data}
        layout={chart.layout}
        config={chart.config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler
      />
    </>
  );
}
