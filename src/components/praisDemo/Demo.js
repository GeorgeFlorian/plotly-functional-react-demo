import { countries, landDegradation } from './getData';
import ChoroplethMap from './ChoroplethMap';

export default function Demo() {
  console.log(countries);
  console.log(landDegradation);

  return (
    <div>
      <ChoroplethMap />
    </div>
  );
}
