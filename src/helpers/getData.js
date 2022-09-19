import barChartData from '../data/barChartData.json';
import ALL_DATA from '../data/allData.json';

// Data for Bar Chart (Degraded Land vs Non Degraded Land)
const land = Object.keys(barChartData);
export const landTypes = land.map((land) => barChartData[land]);

// Data for Stacked Area Chart (drought types in time)

export const stackedAreaChart = (country) => {
  const droughtType = {
    non_drought: { name: 'Non Drought', color: '#a6ee4a' },
    mild_drought: { name: 'Mild Drought', color: '#eee44a' },
    moderate_drought: { name: 'Moderate Drought', color: '#f88502' },
    severe_drought: { name: 'Severe Drought', color: '#f85500' },
    extreme_drought: { name: 'Extreme Drought', color: '#c42a02' },
  };

  const countries = Object.keys(ALL_DATA);
  const countriesData = countries.reduce((obj, key) => {
    if (ALL_DATA[key]['so3-1'])
      return { ...obj, [key]: [...ALL_DATA[key]['so3-1'].t1] };
    return { ...obj };
  }, {});

  const cty = countriesData[country];
  console.log('cty', cty);

  const foo = Object.keys(droughtType).map((key) => ({
    x: cty.map((country) => country.year),
    y: cty.map((country) => country[key]),
    stackgroup: 'one',
    name: droughtType[key].name,
    fillcolor: droughtType[key].color,
    line: { color: '#fff' },
    textfont: { color: '#000' },
  }));

  return { data: foo, layout: { title: country } };
};
