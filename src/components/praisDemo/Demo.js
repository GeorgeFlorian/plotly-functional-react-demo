import { Card } from 'antd';
import { useState } from 'react';

import classes from './Demo.module.css';

import {
  BarChart,
  GapminderChart,
  StackedAreaChart,
  ButterflyChart,
  SunburstChart,
  TreeMap,
} from './Charts/index';

const tabListNoTitle = [
  {
    key: 'barChart',
    tab: 'Bar Chart',
  },
  {
    key: 'stackedAreaChart',
    tab: 'Stacked Area Chart',
  },
  {
    key: 'gapminderChart',
    tab: 'Gapminder Chart',
  },
  {
    key: 'butterflyChart',
    tab: 'Butterfly Chart',
  },
  {
    key: 'sunburst',
    tab: 'Sunburst Chart',
  },
  {
    key: 'treeMap',
    tab: 'Tree Map',
  },
];

const contentListNoTitle = {
  barChart: <BarChart />,
  stackedAreaChart: <StackedAreaChart />,
  gapminderChart: <GapminderChart />,
  butterflyChart: <ButterflyChart />,
  sunburst: <SunburstChart />,
  treeMap: <TreeMap />,
};

export default function PlotlyTutorial() {
  const [activeTabKey, setActiveTabKey] = useState('sunburst');

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  return (
    <div className={classes['plot-wrapper']}>
      <Card
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey}
        onTabChange={(key) => {
          onTabChange(key);
        }}
        tabProps={{ centered: true }}
      >
        <Card.Grid
          hoverable={false}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 700,
          }}
        >
          {contentListNoTitle[activeTabKey]}
        </Card.Grid>
      </Card>
    </div>
  );
}
