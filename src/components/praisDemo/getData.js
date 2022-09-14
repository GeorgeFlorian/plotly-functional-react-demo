import ALL_DATA from '../../data/allData.json';

export const countries = Object.keys(ALL_DATA);
const countries_so1_4 = countries.map((country) => ALL_DATA[country]['so1-4']);

export const landDegradation = countries_so1_4.map((country) => country?.t1);
