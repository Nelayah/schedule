import * as R from 'ramda';
import * as utils from '../lib/lib/utils';

const getTimesGroupFunc = arr => group => R.compose(
  R.map(R.pick(['rowStartKey', 'rowEndKey'])),
  R.filter(R.propEq('_track', group)),
  R.prop('times')
)(arr);

describe('工具类', () => {
  it('能正确计算不交叉时间段最小分组', () => {
    /**
     * 入参：
     * [08:00-9:15], [09:10-10:00], [09:15-10:05], [9:30-10:30], [08:00-13:00], [10:10-11:00], [10:15-11:15]
     *
     * 期望结果：
     * 组1: [08:00-9:15], [09:15-10:05], [10:10-11:00]
     * 组2: [08:00-13:00]
     * 组3: [09:10-10:00], [10:15-11:15]
     * 组4: [9:30-10:30]
     */
    const mockData = [
      {rowStartKey: '08:00', rowEndKey: '09:15'},
      {rowStartKey: '09:10', rowEndKey: '10:00'},
      {rowStartKey: '09:15', rowEndKey: '10:05'},
      {rowStartKey: '09:30', rowEndKey: '10:30'},
      {rowStartKey: '08:00', rowEndKey: '13:00'},
      {rowStartKey: '10:10', rowEndKey: '11:00'},
      {rowStartKey: '10:15', rowEndKey: '11:15'}
    ];
    const data = utils.preProcessing(mockData);
    const getTimesGroup = getTimesGroupFunc(data);

    // 组1: [08:00-9:15], [09:15-10:05], [10:10-11:00]
    const getTimesGroup0 = getTimesGroup(0);
    expect(getTimesGroup0.length).toBe(3);
    expect(getTimesGroup0).toContainEqual({rowStartKey: '08:00', rowEndKey: '09:15'});
    expect(getTimesGroup0).toContainEqual({rowStartKey: '09:15', rowEndKey: '10:05'});
    expect(getTimesGroup0).toContainEqual({rowStartKey: '10:10', rowEndKey: '11:00'});

    // 组2: [08:00-13:00]
    const getTimesGroup1 = getTimesGroup(1);
    expect(getTimesGroup1.length).toBe(1);
    expect(getTimesGroup1).toContainEqual({rowStartKey: '08:00', rowEndKey: '13:00'});

    // 组3: [09:10-10:00], [10:15-11:15]
    const getTimesGroup2 = getTimesGroup(2);
    expect(getTimesGroup2.length).toBe(2);
    expect(getTimesGroup2).toContainEqual({rowStartKey: '09:10', rowEndKey: '10:00'});
    expect(getTimesGroup2).toContainEqual({rowStartKey: '10:15', rowEndKey: '11:15'});

    // 组4: [9:30-10:30]
    const getTimesGroup3 = getTimesGroup(3);
    expect(getTimesGroup3.length).toBe(1);
    expect(getTimesGroup3).toContainEqual({rowStartKey: '09:30', rowEndKey: '10:30'});
    expect(getTimesGroup3).not.toContainEqual({rowStartKey: '09:30', rowEndKey: '10:31'});
  });

  /**
   * 入参：
   * {_track: 4, _overlay: [{_track: 9}, {_track: 3}, {_track: 4}, {_track: 8}]}
   *
   * 期望结果：8
   *
   * 入参：
   * {_track: 9, _overlay: [{_track: 9}, {_track: 3}, {_track: 4}, {_track: 8}]}
   *
   * 期望结果：MAX_REF_NUMBER
   */

  it('找出重叠区域最近右边区域', () => {
    const data = {_track: 4, _overlay: [{_track: 9}, {_track: 3}, {_track: 4}, {_track: 8}]};
    expect(utils.findTheMinimumGreater(data)).toEqual(8);

    data._track = 9;
    expect(utils.findTheMinimumGreater(data)).toEqual(utils.MAX_REF_NUMBER);
  });
});