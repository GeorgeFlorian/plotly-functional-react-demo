import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

export function GapminderAnimation() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      showlegend: true,
      autosize: true,
    },
    frames: [],
    config: { responsive: true },
  });

  useEffect(() => {
    const getCSV = async () => {
      const csvData = await d3.csv(
        'https://raw.githubusercontent.com/plotly/datasets/master/gapminderDataFiveYear.csv'
      );

      // Create a lookup table to sort and regroup the columns of data,
      // first by year, then by continent:
      let lookup = {};

      function getData(year, continent) {
        let byYear, trace;
        if (!(byYear = lookup[year])) {
          byYear = lookup[year] = {};
        }
        // If a container for this year + continent doesn't exist yet,
        // then create one:
        if (!(trace = byYear[continent])) {
          trace = byYear[continent] = {
            x: [],
            y: [],
            id: [],
            text: [],
            marker: { size: [] },
          };
        }
        return trace;
      }

      // Go through each row, get the right trace, and append the data:
      for (let i = 0; i < csvData.length; i++) {
        let datum = csvData[i];
        let trace = getData(datum.year, datum.continent);
        trace.text.push(datum.country);
        trace.id.push(datum.country);
        trace.x.push(datum.lifeExp);
        trace.y.push(datum.gdpPercap);
        trace.marker.size.push(datum.pop);
      }

      // Get the group names:
      const years = Object.keys(lookup);
      // In this case, every year includes every continent, so we
      // can just infer the continents from the *first* year:
      const firstYear = lookup[years[0]];
      const continents = Object.keys(firstYear);

      // Create the main traces, one for each continent:
      const traces = [];
      for (let i = 0; i < continents.length; i++) {
        const data = firstYear[continents[i]];
        // One small note. We're creating a single trace here, to which
        // the frames will pass data for the different years. It's
        // subtle, but to avoid data reference problems, we'll slice
        // the arrays to ensure we never write any new data into our
        // lookup table:
        traces.push({
          name: continents[i],
          x: data.x.slice(),
          y: data.y.slice(),
          id: data.id.slice(),
          text: data.text.slice(),
          mode: 'markers',
          marker: {
            size: data.marker.size.slice(),
            sizemode: 'area',
            sizeref: 200000,
          },
        });
      }

      // Create a frame for each year. Frames are effectively just
      // traces, except they don't need to contain the *full* trace
      // definition (for example, appearance). The frames just need
      // the parts the traces that change (here, the data).
      const frames = [];
      for (let i = 0; i < years.length; i++) {
        frames.push({
          name: years[i],
          data: continents.map(function (continent) {
            return getData(years[i], continent);
          }),
        });
      }

      // Now create slider steps, one for each frame. The slider
      // executes a plotly.js API command (here, Plotly.animate).
      // In this example, we'll animate to one of the named frames
      // created in the above loop.
      const sliderSteps = [];
      for (let i = 0; i < years.length; i++) {
        sliderSteps.push({
          method: 'animate',
          label: years[i],
          args: [
            [years[i]],
            {
              mode: 'immediate',
              transition: { duration: 300 },
              frame: { duration: 300, redraw: false },
            },
          ],
        });
      }

      const layout = {
        xaxis: {
          title: 'Life Expectancy',
          range: [30, 85],
        },
        yaxis: {
          title: 'GDP per Capita',
          type: 'log',
        },
        hovermode: 'closest',
        // We'll use updatemenus (whose functionality includes menus as
        // well as buttons) to create a play button and a pause button.
        // The play button works by passing `null`, which indicates that
        // Plotly should animate all frames. The pause button works by
        // passing `[null]`, which indicates we'd like to interrupt any
        // currently running animations with a new list of frames. Here
        // The new list of frames is empty, so it halts the animation.
        updatemenus: [
          {
            x: 0,
            y: 0,
            yanchor: 'top',
            xanchor: 'left',
            showactive: false,
            direction: 'left',
            type: 'buttons',
            pad: { t: 87, r: 10 },
            buttons: [
              {
                method: 'animate',
                args: [
                  null,
                  {
                    mode: 'immediate',
                    fromcurrent: true,
                    transition: { duration: 300 },
                    frame: { duration: 500, redraw: false },
                  },
                ],
                label: 'Play',
              },
              {
                method: 'animate',
                args: [
                  [null],
                  {
                    mode: 'immediate',
                    transition: { duration: 0 },
                    frame: { duration: 0, redraw: false },
                  },
                ],
                label: 'Pause',
              },
            ],
          },
        ],
        // Finally, add the slider and use `pad` to position it
        // nicely next to the buttons.
        sliders: [
          {
            pad: { l: 130, t: 55 },
            currentvalue: {
              visible: true,
              prefix: 'Year:',
              xanchor: 'right',
              font: { size: 20, color: '#666' },
            },
            steps: sliderSteps,
          },
        ],
      };

      setChart((prevState) => ({
        ...prevState,
        data: traces,
        layout: {
          ...prevState.layout,
          ...layout,
        },
        frames: frames,
      }));
    };

    getCSV();
  }, [setChart]);

  return (
    <Plot
      data={chart.data}
      layout={chart.layout}
      frames={chart.frames}
      config={chart.config}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  );
}
