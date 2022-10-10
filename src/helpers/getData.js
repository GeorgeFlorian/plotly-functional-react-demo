import WORLD_SDG from '../data/SDG/world.json'; // array
import COUNTRY_CODES from '../data/countries.json'; // array
import COUNTRY_DATA from '../data/allData.json'; // object

const sumAllObjectValues = (obj) => {
  // console.log(Object.keys(obj));
  if (Object.keys(obj).length !== 0)
    return Object.values(obj).reduce((a, b) => Number(a) + Number(b));
  return 0;
};

const years = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,
  2013, 2014, 2015, 2016, 2017, 2018, 2019,
];

// function percentage(partialValue, totalValue) {
//   const partial = Number(partialValue);
//   const total = Number(totalValue);
//   if (partial === 0 || total === 0) return 0;
//   return ((100 * partial) / total).toFixed(2);
// }

// BarChart Endpoint
// /api/q1/region-degraded-land-percentage/
// get only top level regions
// percentage of degraded land =
// sum of total area of degraded land (from SO1-4.T1) /
// total land area (from SO1-1.T1, year 2015 for baseline, year 2019 for reporting)

export const barChartEndpoint = () => {
  return WORLD_SDG.reduce((acc, region) => {
    let regionDegradedLand = 0;
    let regionTotalLandArea = 0;
    const percentageDegradedLandByRegion = region.countries.reduce(
      (regionPercentage, country) => {
        const countryISO3 = COUNTRY_CODES.find(
          (el) => el.name === country
        ).iso3;
        if (COUNTRY_DATA[countryISO3]) {
          const countryDegradedLandByYear = COUNTRY_DATA[countryISO3][
            'so1-4'
          ].t1.find((ele) => ele.id === 'baseline_period').degraded_area;
          const countryTotalLandArea = COUNTRY_DATA[countryISO3][
            'so1-1'
          ].t1.find((ele) => ele.year === '2015').total_land_area;
          regionDegradedLand += Number(countryDegradedLandByYear);
          regionTotalLandArea += Number(countryTotalLandArea);
          regionPercentage = regionDegradedLand / regionTotalLandArea;
          // console.log(countryISO3, countryDegradedLandByYear, countryTotalLandArea);
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

export const stackedAreaChartEndpoint = () => {
  const droughtType = {
    non_drought: { name: 'Non Drought', color: '#a6ee4a' },
    mild_drought: { name: 'Mild Drought', color: '#eee44a' },
    moderate_drought: { name: 'Moderate Drought', color: '#f88502' },
    severe_drought: { name: 'Severe Drought', color: '#f85500' },
    extreme_drought: { name: 'Extreme Drought', color: '#c42a02' },
  };

  const regionsData = WORLD_SDG.reduce((acc, region) => {
    const droughtSum = {
      ...years.reduce(
        (obj, year) => ({
          ...obj,
          [year]: {
            non_drought: 0,
            mild_drought: 0,
            moderate_drought: 0,
            severe_drought: 0,
            extreme_drought: 0,
          },
        }),
        {}
      ),
    };
    const regionTotal = structuredClone(droughtSum);

    region.countries.forEach((country) => {
      const countryISO3 = COUNTRY_CODES.find((el) => el.name === country).iso3;

      if (COUNTRY_DATA[countryISO3]) {
        const countryDegradedLandByYear = COUNTRY_DATA[countryISO3]['so3-1'].t1;
        countryDegradedLandByYear.forEach((year) => {
          if (regionTotal[year.year]) {
            regionTotal[year.year].non_drought +=
              !isNaN(parseFloat(year.non_drought)) && Number(year.non_drought);
            regionTotal[year.year].mild_drought +=
              !isNaN(parseFloat(year.mild_drought)) &&
              Number(year.mild_drought);
            regionTotal[year.year].moderate_drought +=
              !isNaN(parseFloat(year.moderate_drought)) &&
              Number(year.moderate_drought);
            regionTotal[year.year].severe_drought +=
              !isNaN(parseFloat(year.severe_drought)) &&
              Number(year.severe_drought);
            regionTotal[year.year].extreme_drought +=
              !isNaN(parseFloat(year.extreme_drought)) &&
              Number(year.extreme_drought);
          }
        });
      }
    });
    years.forEach((year) => {
      regionTotal[year].total_land_area = sumAllObjectValues(regionTotal[year]);
    });

    // console.log(region.name, regionTotal);

    const newFoo = Object.keys(regionTotal).map((year) => {
      const foo = Object.keys(regionTotal[year]).reduce((total, drought) => {
        if (drought === 'total_land_area') return total;
        total.push({
          year: year,
          class: droughtType[drought].name,
          percentage: Number(
            regionTotal[year][drought] / regionTotal[year].total_land_area
          ).toFixed(2),
        });
        return total;
      }, []);
      return foo;
    });

    // newFoo is an array made of arrays each containing 5 objects: each drought class per year
    console.log(newFoo);

    acc.push({
      code: region.code,
      name: region.name,
      data: newFoo.flat(),
    });
    return acc;
  }, []);

  // Select one region with data similar to the actual endpoint
  // Here, take region at index 0
  const currentRegion = regionsData[0];
  console.log('currentRegion', currentRegion);

  const plotData = Object.keys(droughtType).map((drought) => {
    // filter region data by drought class
    const droughtClass = currentRegion.data.filter(
      (el) => el.class === droughtType[drought].name
    );

    return {
      x: droughtClass.map((ele) => ele.year),
      y: droughtClass.map((ele) => Number(ele.percentage * 100).toFixed(2)),
      stackgroup: 'one',
      // setting norm to percent normalizes the values relative to 100%
      // but the values do not add up to 100
      // so the percentages get altered so that they add up to 100
      groupnorm: 'percent',
      name: droughtType[drought].name,
      fillcolor: droughtType[drought].color,

      text: droughtClass.map((ele) => ele.class),
      line: { color: '#fff' },
      textfont: { color: '#000' },
      hovertemplate: '%{text}<br>%{x} - %{y:.2f}% <extra></extra>',
    };
  });

  return { data: plotData, title: currentRegion.name };
};

const countryDegradedLand = () => {
  const countriesData = [];
  WORLD_SDG.forEach((region) => {
    region.countries.forEach((country) => {
      const countryISO3 = COUNTRY_CODES.find((el) => el.name === country).iso3;
      if (COUNTRY_DATA[countryISO3]) {
        const countryDegradedLandByYear = COUNTRY_DATA[countryISO3][
          'so1-4'
        ].t1.find((ele) => ele.id === 'baseline_period').degraded_area;
        const countryTotalLandArea = COUNTRY_DATA[countryISO3]['so1-1'].t1.find(
          (ele) => ele.year === '2015'
        ).total_land_area;

        const countryPercent = Number(
          countryDegradedLandByYear / countryTotalLandArea
        );
        countriesData.push({
          name: country,
          iso3: countryISO3,
          percentage: (countryPercent * 100).toFixed(2),
        });
      }
    });
  });
  return countriesData;
};

const subRegionDegradedLand = () => {
  const subregions = [];
  WORLD_SDG.forEach((region) => {
    if (region.subregions.length > 0) {
      region.subregions.forEach((subregion) => {
        let regionDegradedLand = 0;
        let regionTotalLandArea = 0;
        const subregionPercentage = subregion.countries.reduce(
          (percentage, country) => {
            const countryISO3 = COUNTRY_CODES.find(
              (el) => el.name === country
            ).iso3;
            if (COUNTRY_DATA[countryISO3]) {
              const countryDegradedLandByYear = COUNTRY_DATA[countryISO3][
                'so1-4'
              ].t1.find((ele) => ele.id === 'baseline_period').degraded_area;
              const countryTotalLandArea = COUNTRY_DATA[countryISO3][
                'so1-1'
              ].t1.find((ele) => ele.year === '2015').total_land_area;

              regionDegradedLand += Number(countryDegradedLandByYear);
              regionTotalLandArea += Number(countryTotalLandArea);
              percentage = regionDegradedLand / regionTotalLandArea;
            }
            return percentage;
          },
          0
        );
        subregions.push({
          code: subregion.code,
          name: subregion.name,
          percentage: (subregionPercentage * 100).toFixed(2),
        });
      });
    }
  });
  return subregions;
};

export const createSunburstChart = () => {
  const regionsData = barChartEndpoint();
  console.log('regionsData', regionsData);

  const subregionsData = subRegionDegradedLand();
  console.log('subregionsData', subregionsData);

  let countriesData = countryDegradedLand();

  // eliminate duplicate countries
  countriesData = countriesData.filter(
    (country, index, self) =>
      index === self.findIndex((cty) => cty.name === country.name)
  );
  console.log('countriesData', countriesData);

  const sunburstChart = {
    labels: [],
    parents: [],
    ids: [],
    values: [],
  };

  WORLD_SDG.forEach((region) => {
    sunburstChart.labels.push(region.name);
    sunburstChart.ids.push(region.name);
    sunburstChart.parents.push('');
    sunburstChart.values.push(
      regionsData.find((el) => el.code === region.code).percentage
    );
    if (region.subregions.length > 0) {
      region.subregions.forEach((sub) => {
        sunburstChart.labels.push(sub.name);
        sunburstChart.ids.push(sub.name);
        sunburstChart.parents.push(region.name);
        sunburstChart.values.push(
          subregionsData.find((el) => el.code === sub.code).percentage
        );
        sub.countries.forEach((country) => {
          sunburstChart.labels.push(country);
          sunburstChart.ids.push(sub.name + ' - ' + country);
          sunburstChart.parents.push(sub.name);
          const foo = countriesData.find((el) => el.name === country);
          sunburstChart.values.push(foo && foo.percentage);
        });
      });
    } else {
      region.countries.forEach((country) => {
        sunburstChart.labels.push(country);
        sunburstChart.ids.push(region.name + ' - ' + country);
        sunburstChart.parents.push(region.name);
        const foo = countriesData.find((el) => el.name === country);
        sunburstChart.values.push(foo && foo.percentage);
      });
    }
  });

  // console.log(sunburstChart);

  return sunburstChart;
};
