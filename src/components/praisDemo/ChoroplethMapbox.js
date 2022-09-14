import { useEffect } from 'react';
import { useState } from 'react';

export default function ChoroplethMapbox() {
  const [chart, setChart] = useState({
    data: [],
    layout: {
      showlegend: false,
      autosize: true,
    },
    frames: [],
    config: { responive: true },
  });

  useEffect(() => {});
  return <div>ChoroplethMapbox</div>;
}
