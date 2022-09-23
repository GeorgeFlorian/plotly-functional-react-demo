import { Card } from 'antd';
import { useState } from 'react';

import classes from './Demo.module.css';

import {
  BarChart,
  GapminderChart,
  StackedAreaChart,
  ButterflyChart,
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
    key: 'butterflychart',
    tab: 'Butterfly Chart',
  },
];

const contentListNoTitle = {
  barChart: <BarChart />,
  stackedAreaChart: <StackedAreaChart />,
  gapminderChart: <GapminderChart />,
  butterflychart: <ButterflyChart />,
};

export default function PlotlyTutorial() {
  const [activeTabKey, setActiveTabKey] = useState('butterflychart');

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
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {contentListNoTitle[activeTabKey]}
        </Card.Grid>
      </Card>
    </div>
  );
}
