import React from 'react';
import { storiesOf } from '@storybook/react';
import Demo from '../lib/demo';

storiesOf('Time Scheduler', module)
  .add('with antd components', () => (
    <Demo />
  ));
