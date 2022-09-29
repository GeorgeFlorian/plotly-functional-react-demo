import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { butterflyChartData } from '../../../helpers/fooData';

// Select country: https://plotly.com/javascript/dropdowns/

export function ButterflyChart() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      showlegend: true,
      legend: {
        x: 0.38,
        y: -0.2,
        orientation: 'h',
        traceorder: 'reversed',
      },
      bargap: 0.2,
      barmode: 'relative',
      autosize: true,
      height: 600,
      font: { size: 15 },
    },
    frames: [],
    config: { responive: true },
  });

  useEffect(() => {
    // get data from endpoint
    const country = 'CAN';
    // butterflyChartData(country);
    const countryData = butterflyChartData(country);

    console.log('countryData', countryData);

    const years = Object.keys(countryData);

    const droughtType = {
      nonDrought: { name: 'Non Drought', color: '#a6ee4a' },
      mildDrought: { name: 'Mild Drought', color: '#eee44a' },
      moderateDrought: {
        name: 'Moderate Drought',
        color: '#f88502',
      },
      severeDrought: {
        name: 'Severe Drought',
        color: '#f85500',
      },
      extremeDrought: {
        name: 'Extreme Drought',
        color: '#c42a02',
      },
    };

    const frames = [];
    for (let i = 0; i < years.length; i++) {
      const female = countryData[years[i]].femalePop;
      const male = countryData[years[i]].malePop;

      // percentage for each type of drought

      const traceFemale = {
        x: [
          Number(female.nonDroughtPercentage),
          Number(female.mildPercentage),
          Number(female.moderatePercentage),
          Number(female.severePercentage),
          Number(female.extremePercentage),
        ],
        y: [
          droughtType.nonDrought.name,
          droughtType.mildDrought.name,
          droughtType.moderateDrought.name,
          droughtType.severeDrought.name,
          droughtType.extremeDrought.name,
        ],
        text: [
          female.nonDroughtPercentage,
          female.mildPercentage,
          female.moderatePercentage,
          female.severePercentage,
          female.extremePercentage,
        ],
        customdata: [
          {
            count: female.non_drought_population_count,
            text: 'are not affected by',
          },
          {
            count: female.mild_drought_population_count,
            text: 'are affected by <b>Mild</b>',
          },
          {
            count: female.moderate_drought_population_count,
            text: 'are affected by <b>Moderate</b>',
          },
          {
            count: female.severe_drought_population_count,
            text: 'are affected by <b>Severe</b>',
          },
          {
            count: female.extreme_drought_population_count,
            text: 'are affected by <b>Extreme</b>',
          },
        ],
        name: 'Women',
      };

      const traceMale = {
        x: [
          -Number(male.nonDroughtPercentage),
          -Number(male.mildPercentage),
          -Number(male.moderatePercentage),
          -Number(male.severePercentage),
          -Number(male.extremePercentage),
        ],
        y: [
          droughtType.nonDrought.name,
          droughtType.mildDrought.name,
          droughtType.moderateDrought.name,
          droughtType.severeDrought.name,
          droughtType.extremeDrought.name,
        ],
        text: [
          male.nonDroughtPercentage,
          male.mildPercentage,
          male.moderatePercentage,
          male.severePercentage,
          male.extremePercentage,
        ],
        customdata: [
          {
            count: male.non_drought_population_count,
            text: 'are not affected by',
          },
          {
            count: male.mild_drought_population_count,
            text: 'are affected by <b>Mild</b>',
          },
          {
            count: male.moderate_drought_population_count,
            text: 'are affected by <b>Moderate</b>',
          },
          {
            count: male.severe_drought_population_count,
            text: 'are affected by <b>Severe</b>',
          },
          {
            count: male.extreme_drought_population_count,
            text: 'are affected by <b>Extreme</b>',
          },
        ],
        name: 'Men',
      };

      frames.push({
        name: years[i],
        data: [traceFemale, traceMale],
      });
    }

    // const traceColors =

    const firstFemaleTrace =
      frames[0].data[0].name === 'Women'
        ? frames[0].data[0]
        : frames[0].data[1];
    const firstMaleTrace =
      frames[0].data[0].name === 'Men' ? frames[0].data[0] : frames[0].data[1];

    const trace1 = {
      meta: {
        columnNames: {
          x: 'Men, x',
          y: 'Women, y; Men, y',
          text: 'text',
        },
      },
      customdata: firstFemaleTrace.customdata,
      name: 'Women',
      type: 'bar',
      x: firstFemaleTrace.x,
      y: firstFemaleTrace.y,
      marker: { color: 'seagreen' },
      text: firstFemaleTrace.text,
      texttemplate: '%{text}%',
      textangle: '0',
      hovertemplate:
        '%{y}<br>' +
        'Approximately <b>%{customdata.count:.2s}</b> <b>women</b> %{customdata.text} drought.<br>' +
        '<extra></extra>',
      orientation: 'h',
    };

    const trace2 = {
      meta: {
        columnNames: {
          x: 'Men, x',
          y: 'Women, y; Men, y',
        },
      },
      name: 'Men',
      type: 'bar',
      x: firstMaleTrace.x,
      y: firstMaleTrace.y,
      customdata: firstMaleTrace.customdata,
      marker: { color: 'powderblue' },
      text: firstMaleTrace.text,
      texttemplate: '%{text}%',
      textangle: '0',
      hovertemplate:
        '%{y}<br>' +
        'Approximately <b>%{customdata.count:.2s}</b> <b>men</b> %{customdata.text} drought.<br>' +
        '<extra></extra>',
      orientation: 'h',
    };

    const data = [trace1, trace2];

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
      title: country,
      xaxis: {
        type: 'linear',
        range: [-105, 105],
        title: {
          text: 'Percentage of the population within each drought intensity class',
        },
        ticktext: ['100%', '70%', '30%', '0%', '30%', '70%', '100%'],
        tickvals: [-100, -70, -30, 0, 30, 70, 100],
      },
      yaxis: {
        type: 'category',
        autorange: true,
        automargin: true,
      },
      updatemenus: [
        {
          x: 0,
          y: 0,
          yanchor: 'top',
          xanchor: 'left',
          showactive: false,
          direction: 'left',
          type: 'buttons',
          pad: { t: 120, r: 10 },
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
      sliders: [
        {
          pad: { l: 150, t: 90 },
          currentvalue: {
            visible: true,
            prefix: 'Year:',
            xanchor: 'right',
            font: { size: 20, color: '#666' },
          },
          steps: sliderSteps,
          transition: {
            duration: 300,
            easing: 'cubic-in-out',
          },
        },
      ],
    };

    setChart((prevState) => ({
      ...prevState,
      data: data,
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
