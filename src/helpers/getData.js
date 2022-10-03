import WORLD_SDG from '../data/SDG/world.json'; // array
import COUNTRY_CODES from '../data/countries.json'; // array
import COUNTRY_DATA from '../data/allData.json'; // object

// const sumAllObjectValues = (obj) => {
//   // console.log(Object.keys(obj));
//   if (Object.keys(obj).length !== 0)
//     return Object.values(obj).reduce((a, b) => Number(a) + Number(b));
//   return 0;
// };

// function percentage(partialValue, totalValue) {
//   const partial = Number(partialValue);
//   const total = Number(totalValue);
//   if (partial === 0 || total === 0) return 0;
//   return ((100 * partial) / total).toFixed(2);
// }

export const createSunburstChart = () => {
  const sunburstChart = {
    labels: [],
    parents: [],
    ids: [],
    // values: [],
  };

  WORLD_SDG.forEach((region) => {
    sunburstChart.labels.push(region.name);
    sunburstChart.ids.push(region.name);
    sunburstChart.parents.push('');
    if (region.subregions.length > 0) {
      region.subregions.forEach((sub) => {
        sunburstChart.labels.push(sub.name);
        sunburstChart.ids.push(sub.name);
        sunburstChart.parents.push(region.name);
        sub.countries.forEach((country) => {
          sunburstChart.labels.push(country);
          sunburstChart.ids.push(sub.name + ' - ' + country);
          sunburstChart.parents.push(sub.name);
        });
      });
    } else {
      region.countries.forEach((country) => {
        sunburstChart.labels.push(country);
        sunburstChart.ids.push(region.name + ' - ' + country);
        sunburstChart.parents.push(region.name);
      });
    }
  });

  console.table(sunburstChart);

  return sunburstChart;
};

// BarChart Endpoint
// /api/q1/region-degraded-land-percentage/
// get only top level regions
// percentage of degraded land =
// sum of total area of degraded land (from SO1-4.T1) /
// total land area (from SO1-1.T1, year 2015 for baseline, year 2019 for reporting)

export const createBarChart = () => {
  return WORLD_SDG.reduce((acc, region) => {
    let regionDegradedLand = 0;
    let regionTotalLandArea = 0;
    const percentageDegradedLandByRegion = region.countries.reduce(
      (regionPercentage, country) => {
        const countryISO3 = COUNTRY_CODES.find(
          (el) => el.name === country
        ).iso3;
        if (COUNTRY_DATA[countryISO3]) {
          const countryDegradedLand = COUNTRY_DATA[countryISO3][
            'so1-4'
          ].t1.find((ele) => ele.id === 'baseline_period').degraded_area;
          const countryTotalLandArea = COUNTRY_DATA[countryISO3][
            'so1-1'
          ].t1.find((ele) => ele.year === '2015').total_land_area;
          regionDegradedLand += Number(countryDegradedLand);
          regionTotalLandArea += Number(countryTotalLandArea);
          regionPercentage = regionDegradedLand / regionTotalLandArea;
          // console.log(countryISO3, countryDegradedLand, countryTotalLandArea);
        }

        return regionPercentage;
      },
      0
    );

    acc.push({
      code: region.code,
      name: region.name,
      percentage: (percentageDegradedLandByRegion * 100).toFixed(2),
    });
    return acc;
  }, []);
};
