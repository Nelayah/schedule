import React from 'react';
import { storiesOf } from '@storybook/react';
import Schedule from '../lib';
import '../lib/style/index.css';
import Example from '../lib/example';

storiesOf('Time Schedule', module)
  .add('Original Component', () => (
    <div style={{padding: 20}}>
      <Schedule
        timelineTitle="Time/Name"
        timelineWidth={120}
        startAt="08:00"
        endAt="22:00"
        cellWidth={200}
        maxWidth={850}
        maxHeight={600}
        columns={[
          {key: 'saber', title: 'Saber'},
          {key: 'archer', title: 'Archer'}
        ]}
        dataSource={[]}
      />
    </div>
  ))
  .add('With Ant Design Components', () => (
    <Example />
  ));
