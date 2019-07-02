import * as React from 'react';
import {mount} from 'enzyme';
import Schedule from '../lib';

describe('组件', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '<div id="mounter" />';
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  it('组件能正常挂载', () => {
    const wrapper = mount(<Schedule />, { attachTo: document.getElementById('mounter') });
    jest.runAllTimers();
    expect(wrapper.exists()).toBe(true);
  });
});