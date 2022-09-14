import { countries, landDegradation } from './getData';

export default function Demo() {
  console.log(landDegradation);

  return (
    <div>
      {countries.map((country, index) => (
        <div key={index}>
          {`${index + 1} - ${country} - ${JSON.stringify(
            landDegradation[index]
          )}`}
          <br />
        </div>
      ))}
    </div>
  );
}
