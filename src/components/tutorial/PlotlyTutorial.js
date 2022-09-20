import { Card } from 'antd';
import { useState } from 'react';

import classes from './PlotlyTutorial.module.css';

import {
  BarChart,
  PieChart,
  ScatterPlot,
  SurfacePlot,
  GapminderAnimation,
} from './index';

const tabListNoTitle = [
  {
    key: 'barChart',
    tab: 'Bar Chart',
  },
  {
    key: 'pieChart',
    tab: 'Pie Chart',
  },
  {
    key: 'scatterPlots',
    tab: 'Scatter Plot',
  },
  {
    key: 'surfacePlots',
    tab: '3D Surface Plot',
  },
  {
    key: 'gapminderAnimation',
    tab: 'Gapminder Animation',
  },
];

const contentListNoTitle = {
  barChart: <BarChart />,
  pieChart: <PieChart />,
  scatterPlots: <ScatterPlot />,
  surfacePlots: <SurfacePlot />,
  gapminderAnimation: <GapminderAnimation />,
};

export default function PlotlyTutorial() {
  const [activeTabKey, setActiveTabKey] = useState('barChart');

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
