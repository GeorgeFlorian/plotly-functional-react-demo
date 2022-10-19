import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { anotherGapminderEndpoint } from '../../../helpers/getData';

// To add custom hovertemplate for bubbles
// https://plotly.com/javascript/hover-text-and-formatting/

export function GapminderChart() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      showlegend: true,
      autosize: true,
      height: 1000,
      width: 1500,
    },
    frames: [],
    config: { responsive: true },
  });

  useEffect(() => {
    // console.log(anotherGapminderEndpoint());

    // const myData = gapminderEndpoint().countries;
    const myData = anotherGapminderEndpoint();

    // const myData = anotherGapminderEndpoint().filter(
    //   (country) =>
    //     country.region === 'Landlocked developing countries (LLDCs)' ||
    //     country.region === `Central Asia (M49) and Southern Asia (MDG=M49)`
    // );

    console.log(myData);

    // Create a lookup table to sort and regroup the columns of data,
    // first by year, then by group:
    let lookup = {};

    function getData(year, group) {
      let byYear, trace;
      if (!(byYear = lookup[year])) {
        byYear = lookup[year] = {};
      }
      // If a container for this year + group doesn't exist yet,
      // then create one:
      if (!(trace = byYear[group])) {
        trace = byYear[group] = {
          x: [],
          y: [],
          id: [],
          text: [],
          marker: { size: [] },
          hovertemplate: '',
        };
      }
      return trace;
    }

    // Go through each row, get the right trace, and append the data:
    for (let i = 0; i < myData.length; i++) {
      const datum = myData[i];
      const trace = getData(datum.year, datum.region);
      // console.log('trace', trace);
      trace.text.push(datum.name);
      trace.id.push(datum.name);
      trace.x.push(datum.land_drought_percentage);
      trace.y.push(datum.population_drought_percentage);
      trace.marker.size.push(datum.population);
      trace.hovertemplate = '%{y} - %{x:.2f}% <extra></extra>';
    }

    // Get the group names:
    const years = Object.keys(lookup);
    // In this case, every year includes every group, so we
    // can just infer the groups from the *first* year:
    const firstYear = lookup[years[0]];
    const groups = Object.keys(firstYear);

    // Create the main traces, one for each group:
    const traces = [];
    for (let i = 0; i < groups.length; i++) {
      const data = firstYear[groups[i]];
      // One small note. We're creating a single trace here, to which
      // the frames will pass data for the different years. It's
      // subtle, but to avoid data reference problems, we'll slice
      // the arrays to ensure we never write any new data into our
      // lookup table:
      traces.push({
        name: groups[i],
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
        hovertemplate:
          '%{text}<br>' +
          'Land affected by drought: %{x:.2f}%<br>' +
          'Population affected by drought: %{y:.2f}%' +
          '<extra></extra>',
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
        data: groups.map(function (group) {
          return getData(years[i], group);
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
        title: '% of land affected by drought',
        range: [-5, 105],
      },
      yaxis: {
        title: '% percentage of population affected by drought',
        // type: 'log',
        range: [-5, 105],
      },
      hovermode: 'closest',
      // We'll use updatemenus (whose functionality includes menus as
      // well as buttons) to create a play button and a pause button.
      // The play button works by passing `null`, which indicates that
      // Plotly should animate all frames. The pause button works by
      // passing `[null]`, which indicates we'd like to interrupt any
      // currently running animations with a new list of frames. Here
      // the new list of frames is empty, so it halts the animation.
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
