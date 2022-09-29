import WORLD_SDG from '../data/SDG/world.json';
import COUNTRIES from '../data/countries.json';

const stackedAreaChart = {
  labels: [],
  parents: [],
  ids: [],
};

// region, region, region, subregion?country, subregion?country

export const doSomething = () => {
  // console.log(WORLD_SDG);
  WORLD_SDG.forEach((region) => {
    stackedAreaChart.labels.push(region.name);
    stackedAreaChart.ids.push(region.name);
    stackedAreaChart.parents.push('');
    if (region.subregions.length > 0) {
      region.subregions.forEach((sub) => {
        stackedAreaChart.labels.push(sub.name);
        stackedAreaChart.ids.push(sub.name);
        stackedAreaChart.parents.push(region.name);
        sub.countries.forEach((country) => {
          stackedAreaChart.labels.push(country);
          stackedAreaChart.ids.push(sub.name + ' - ' + country);
          stackedAreaChart.parents.push(sub.name);
        });
      });
    } else {
      region.countries.forEach((country) => {
        stackedAreaChart.labels.push(country);
        stackedAreaChart.ids.push(region.name + ' - ' + country);
        stackedAreaChart.parents.push(region.name);
      });
    }
  });

  console.table(stackedAreaChart);

  return stackedAreaChart;
};

// Stacked area chart - endpoint
