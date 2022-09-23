import barChartData from '../data/barChartData.json';
import ALL_DATA from '../data/allData.json';

const droughtType = {
  non_drought: { name: 'Non Drought', color: '#a6ee4a' },
  mild_drought: { name: 'Mild Drought', color: '#eee44a' },
  moderate_drought: { name: 'Moderate Drought', color: '#f88502' },
  severe_drought: { name: 'Severe Drought', color: '#f85500' },
  extreme_drought: { name: 'Extreme Drought', color: '#c42a02' },
};

const sumAllObjectValues = (obj) => {
  // console.log(Object.keys(obj));
  if (Object.keys(obj).length !== 0)
    return Object.values(obj).reduce((a, b) => Number(a) + Number(b));
  return 0;
};

function percentage(partialValue, totalValue) {
  const partial = Number(partialValue);
  const total = Number(totalValue);
  if (partial === 0 || total === 0) return 0;
  return ((100 * partial) / total).toFixed(2);
}

const countries = Object.keys(ALL_DATA);

// Data for Bar Chart (Degraded Land vs Non Degraded Land)
const land = Object.keys(barChartData);
export const landTypes = land.map((land) => barChartData[land]);

// Data for Stacked Area Chart (drought types in time)
export const stackedAreaChart = (country) => {
  const countriesLandDroughtByYear = countries.reduce((obj, key) => {
    if (ALL_DATA[key]['so3-1'])
      return { ...obj, [key]: [...ALL_DATA[key]['so3-1'].t1] };
    return { ...obj };
  }, {});

  const cty = countriesLandDroughtByYear[country];
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

export const gapminderChart = () => {
  // const sortable = Object.fromEntries(
  //   Object.entries(countriesData).sort(([, a], [, b]) => b - a)
  // );

  function between(x, min, max) {
    return x >= min && x <= max;
  }

  // const groups = {
  //   xl: 'Very large countries',
  //   l: 'Large countries',
  //   medium: 'Medium countries',
  //   s: 'Small countries',
  //   xs: 'Very small countries',
  // };

  const countriesData = countries.reduce((obj, key) => {
    const foo = {};
    foo[key] = {};
    // Each country population = sum of so3-2 t1
    const totalPopulationByYear =
      ALL_DATA[key]['so3-2'] &&
      ALL_DATA[key]['so3-2'].t1.reduce((obj, key) => {
        const { year, ...pop } = key;
        return {
          ...obj,
          [key.year]: sumAllObjectValues(pop),
        };
      }, {});
    foo[key].total_population = totalPopulationByYear
      ? totalPopulationByYear
      : 0;
    // Population affected by drought
    const totalPopAffectedByDroughtByYear =
      ALL_DATA[key]['so3-2'] &&
      ALL_DATA[key]['so3-2'].t1.reduce((obj, key) => {
        const { year, non_drought_population_count, ...pop } = key;
        return {
          ...obj,
          [key.year]: sumAllObjectValues(pop),
        };
      }, {});
    foo[key].pop_drought = totalPopAffectedByDroughtByYear
      ? totalPopAffectedByDroughtByYear
      : 0;

    // Get years so3-2 t1
    // Each total land with drought
    const totalLandDrought =
      ALL_DATA[key]['so3-1'] &&
      ALL_DATA[key]['so3-1'].t1.reduce((obj, key) => {
        const { year, non_drought, ...drought } = key;
        return {
          ...obj,
          [key.year]: sumAllObjectValues(drought),
        };
      }, {});
    foo[key].total_land_drought = totalLandDrought ? totalLandDrought : 0;

    // Each total_country_area
    const totalLand =
      ALL_DATA[key]['so1-1'] && ALL_DATA[key]['so1-1'].t1[0].total_country_area;
    foo[key].total_country_area = totalLand ? totalLand : 0;

    // Group countries by total_country_area
    if (foo[key].total_country_area > 5000000) foo[key].group = 'xl';
    if (between(foo[key].total_country_area, 1000000, 5000000))
      foo[key].group = 'l';
    if (between(foo[key].total_country_area, 500000, 1000000))
      foo[key].group = 'm';
    if (between(foo[key].total_country_area, 100000, 500000))
      foo[key].group = 's';
    if (foo[key].total_country_area < 100000) foo[key].group = 'xs';

    // percentage of population affected by drought - so3-2 t1

    // percentage of land affected by drought - so3-1 t1

    return { ...obj, ...foo };
  }, {});

  // console.log('countriesData', countriesData);
  const years = Object.keys(Object.values(countriesData)[0].total_land_drought);
  // console.log(years);
  years.pop('2020');
  years.pop('2021');

  //  country, year, pop, continent, lifeExp, gdpPercap
  // Afghanistan,1952,8425333,Asia,28.801,779.4453145

  // country, year, log(pop), group, X axis: percentage of land affected by drought, Y axis: percentage of population affected by drought

  // array push { country, year, pop, continent, lifeExp, gdpPercap }
  const everything = [];
  for (const country in countriesData) {
    for (let i = 0; i < years.length; i++) {
      if (years[i] === 2020 || years[i] === 2021) continue;
      const foo = {
        country: '',
        year: '',
        pop: '',
        group: '',
        percentage_land_drought: '',
        percentage_pop_drought: '',
      };
      foo.year = years[i];
      foo.country = country;
      foo.pop = countriesData[country].total_population[years[i]];
      foo.group = countriesData[country].group;
      foo.percentage_land_drought = percentage(
        countriesData[country].total_land_drought[years[i]],
        countriesData[country].total_country_area
      );
      foo.percentage_pop_drought = percentage(
        countriesData[country].pop_drought[years[i]],
        countriesData[country].total_population[years[i]]
      );
      everything.push(foo);
    }
  }

  return everything;
};

export const butterflyChartData = (country) => {
  const popDroughtByYear = countries.reduce((obj, key) => {
    if (ALL_DATA[key]['so3-2'])
      return {
        ...obj,
        [key]: {
          totalPop: [...ALL_DATA[key]['so3-2'].t1],
          femalePop: [...ALL_DATA[key]['so3-2'].t2],
          malePop: [...ALL_DATA[key]['so3-2'].t3],
        },
      };
    return { ...obj };
  }, {});

  const currentCountry = popDroughtByYear[country];
  console.log(country, currentCountry);
  const data = {};

  // const getData = (data, populationType) => {
  //   const foo = {};
  //   for (const obj of data) {
  //     const { year, non_drought_population_count, ...droughtAffectedPop } = obj;
  //     const {
  //       mild_drought_population_count,
  //       moderate_drought_population_count,
  //       severe_drought_population_count,
  //       extreme_drought_population_count,
  //     } = droughtAffectedPop;

  //     const totalPop =
  //       +non_drought_population_count + sumAllObjectValues(droughtAffectedPop);

  //     if (!isNaN(totalPop))
  //       foo[year] = {
  //         [populationType]: {
  //           totalPop: totalPop.toString(),
  //           ...droughtAffectedPop,
  //         },
  //       };
  //   }
  //   return foo;
  // };

  // const totalPop = getData(currentCountry.totalPop, 'totalPop');
  // const femalePop = getData(currentCountry.femalePop, 'femalePop');
  // const malePop = getData(currentCountry.malePop, 'malePop');

  // Get total population and affected by drought
  for (const obj of currentCountry.totalPop) {
    const { year, non_drought_population_count, ...droughtAffectedPop } = obj;
    const {
      mild_drought_population_count,
      moderate_drought_population_count,
      severe_drought_population_count,
      extreme_drought_population_count,
    } = droughtAffectedPop;

    const totalPop =
      +non_drought_population_count + sumAllObjectValues(droughtAffectedPop);

    if (!isNaN(totalPop))
      data[year] = {
        totalPop: {
          totalPop: totalPop.toString(),
          ...droughtAffectedPop,
        },
      };
  }
  // Get female total population and affected by drought
  for (const obj of currentCountry.femalePop) {
    const { year, non_drought_population_count, ...droughtAffectedPop } = obj;
    const {
      mild_drought_population_count,
      moderate_drought_population_count,
      severe_drought_population_count,
      extreme_drought_population_count,
    } = droughtAffectedPop;

    const totalPop =
      +non_drought_population_count + sumAllObjectValues(droughtAffectedPop);

    if (!isNaN(totalPop))
      data[year] = {
        ...data[year],
        femalePop: {
          totalPop: totalPop.toString(),
          ...droughtAffectedPop,
          non_drought_population_count,
          nonDroughtPercentage: percentage(
            non_drought_population_count,
            totalPop
          ),
          mildPercentage: percentage(mild_drought_population_count, totalPop),
          moderatePercentage: percentage(
            moderate_drought_population_count,
            totalPop
          ),
          severePercentage: percentage(
            severe_drought_population_count,
            totalPop
          ),
          extremePercentage: percentage(
            extreme_drought_population_count,
            totalPop
          ),
        },
      };
  }
  // Get male total population and affected by drought
  for (const obj of currentCountry.malePop) {
    const { year, non_drought_population_count, ...droughtAffectedPop } = obj;
    const {
      mild_drought_population_count,
      moderate_drought_population_count,
      severe_drought_population_count,
      extreme_drought_population_count,
    } = droughtAffectedPop;

    const totalPop =
      +non_drought_population_count + sumAllObjectValues(droughtAffectedPop);

    if (!isNaN(totalPop))
      data[year] = {
        ...data[year],
        malePop: {
          totalPop: totalPop.toString(),
          ...droughtAffectedPop,
          non_drought_population_count,
          nonDroughtPercentage: percentage(
            non_drought_population_count,
            totalPop
          ),
          mildPercentage: percentage(mild_drought_population_count, totalPop),
          moderatePercentage: percentage(
            moderate_drought_population_count,
            totalPop
          ),
          severePercentage: percentage(
            severe_drought_population_count,
            totalPop
          ),
          extremePercentage: percentage(
            extreme_drought_population_count,
            totalPop
          ),
        },
      };
  }

  return data;
};
