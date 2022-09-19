import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { countries, landDegradation } from '../getData';

export default function ChoroplethMap() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      showlegend: false,
      autosize: true,
    },
    frames: [],
    config: { responive: true },
  });

  useEffect(() => {
    let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const data = [
      {
        type: 'choropleth',
        locationmode: 'country names',
        locations: [...countries.map((country) => regionNames.of(country))],
        z: [
          ...landDegradation.map((country) =>
            country && country.id === 'baseline_period'
              ? country.degraded_area
              : '0'
          ),
        ],
        text: [...countries],
        autocolorscale: true,
      },
    ];
    const layout = {
      title: 'Land Degradation',
      geo: { projection: { type: 'robinson' } },
    };

    setChart((prevState) => ({
      ...prevState,
      data: data,
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
