import { Button } from 'antd';
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
      leaf: { opacity: 0.5 },
      marker: {
        line: { width: 2 },
        // colorscale: 'Greens',
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

const MILD_DROUGHT = {
  data: [
    {
      type: 'treemap',
      sort: false,
      labels: [
        'Mild Drought',
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
        'Mild Drought',
        'Mild Drought',
        'Mild Drought',
        'Mild Drought',
        'Mild Drought',

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
        25, 6, 5, 4, 5, 5, 1, 2, 1, 2, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1,
      ],
      leaf: { opacity: 0.5 },
      marker: {
        line: { width: 2 },
        // colorscale: 'Blues',
      },
      branchvalues: 'total',
    },
  ],
};

export function TreeMap() {
  const [chart, setChart] = useState(DEFAULT_STATE);
  const [newChart, setNewChart] = useState({ layout: DEFAULT_STATE.layout });

  useEffect(() => {
    // console.log(data);

    setNewChart((prevState) => ({
      data: [
        {
          type: 'treemap',
          branchvalues: 'total',
          labels: DEFAULT_STATE.data[0].labels,
          parents: DEFAULT_STATE.data[0].parents,
          values: DEFAULT_STATE.data[0].values,
          textinfo: 'label+value+percent parent+percent entry',
          domain: { x: [0, 0.48] },
          outsidetextfont: { size: 20, color: '#377eb8' },
          marker: { line: { width: 2 } },
          pathbar: { visible: false },
        },
        {
          type: 'treemap',
          branchvalues: 'total',
          labels: MILD_DROUGHT.data[0].labels,
          parents: MILD_DROUGHT.data[0].parents,
          domain: { x: [0.52, 1] },
          values: MILD_DROUGHT.data[0].values,
          textinfo: 'label+value+percent parent+percent entry',
          outsidetextfont: { size: 20, color: '#377eb8' },
          marker: { line: { width: 2 } },
          pathbar: { visible: false },
        },
      ],
      layout: { ...prevState.layout },
      config: { ...prevState.config },
    }));
  }, [setNewChart]);

  const changeDroughtClass = (e) => {
    console.log('chart.data', chart.data);
    console.log(e.currentTarget.innerText);
    const data = [];
    if (e.currentTarget.innerText === 'Mild Drought')
      data.push(...MILD_DROUGHT.data);
    else data.push(...DEFAULT_STATE.data);
    console.log('data', data);

    setChart((prevState) => ({
      data: [...data],
      layout: { ...prevState.layout },
      config: { ...prevState.config },
    }));
  };

  const onUpdatePlot = () => {
    console.log('Plot Updated');
  };

  return (
    <>
      <Plot
        data={chart.data}
        layout={chart.layout}
        config={chart.config}
        style={{ width: '100%', height: '100%' }}
        onUpdate={onUpdatePlot}
        useResizeHandler
      />
      <div className='buttons'>
        <Button type='primary' onClick={changeDroughtClass}>
          Non Drought
        </Button>
        <Button type='primary' onClick={changeDroughtClass}>
          Mild Drought
        </Button>
      </div>
      <Plot
        data={newChart.data}
        layout={newChart.layout}
        config={newChart.config}
        style={{ width: '100%', height: '100%' }}
        onUpdate={onUpdatePlot}
        useResizeHandler
      />
    </>
  );
}
