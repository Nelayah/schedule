import * as R from 'ramda';
import moment from '../lib/lib/moment-es6';
import TimeProcessor from '../lib/lib/TimeProcessor';

describe('时间处理类', () => {
  const startTimestamp = (new Date('2000-01-01 08:00')).valueOf();
  const mockInstance = TimeProcessor.of(startTimestamp, '20:00');

  it('能TimeProcessor 类的实例化', () => {
    expect(mockInstance instanceof TimeProcessor).toBe(true);
  });

  it('能正确计算两个时间分钟差', () => {
    expect(mockInstance.calculateDiffMinutes()).toBe(720);
  });

  it('能正常时间序列化', () => {
    const transform = R.map((v: any) => v.toJSON());
    const serialize30 = TimeProcessor.of('08:00', '13:00').serialize(30);
    const serialize60 = TimeProcessor.of('08:00', '13:00').serialize(60);
    const mockSerialize30 = [
      '2000-01-01T00:00:00.000Z',
      '2000-01-01T00:30:00.000Z',
      '2000-01-01T01:00:00.000Z',
      '2000-01-01T01:30:00.000Z',
      '2000-01-01T02:00:00.000Z',
      '2000-01-01T02:30:00.000Z',
      '2000-01-01T03:00:00.000Z',
      '2000-01-01T03:30:00.000Z',
      '2000-01-01T04:00:00.000Z',
      '2000-01-01T04:30:00.000Z',
      '2000-01-01T05:00:00.000Z'
    ];
    const mockSerialize60 = [
      '2000-01-01T00:00:00.000Z',
      '2000-01-01T01:00:00.000Z',
      '2000-01-01T02:00:00.000Z',
      '2000-01-01T03:00:00.000Z',
      '2000-01-01T04:00:00.000Z',
      '2000-01-01T05:00:00.000Z'
    ];
    expect(mockSerialize30).toEqual(transform(serialize30));
    expect(mockSerialize60).toEqual(transform(serialize60));
  });

  it('能将参数正确转化成 moment 对象', () => {
    const mockTimestamp = '2000-01-01T00:00:00.000Z';
    expect(TimeProcessor.toMoment('08:00').toJSON()).toEqual(mockTimestamp);
    expect(TimeProcessor.toMoment(946684800000).toJSON()).toEqual(mockTimestamp);
    expect(TimeProcessor.toMoment({timestamp: 946684800000})).not.toEqual(mockTimestamp);
    expect(TimeProcessor.toMoment({timestamp: 946684800000})).toMatchObject({timestamp: 946684800000});
  });

  it('能将参数正确转时间戳正确', () => {
    expect(TimeProcessor.toTimestamp('08:00')).toEqual(946684800000);
    expect(TimeProcessor.toTimestamp(moment('2000-01-01 08:00'))).toEqual(946684800000);
    expect(TimeProcessor.toTimestamp(1)).toEqual(1);
  });

  it('能正确判断两个时间段是否重叠', () => {
    // [09:00, 13:45] 与 [13:44, 13:46] 时间重叠
    expect(TimeProcessor.isOverlapping('09:00', '13:45', '13:44', '13:46')).toBe(true);
    // [09:00, 13:45] 与 [09:01, 13:44] 时间重叠
    expect(TimeProcessor.isOverlapping('09:00', '13:45', '09:01', '13:44')).toBe(true);
    // [09:00, 13:45] 与 [13:45, 13:46] 时间不重叠
    expect(TimeProcessor.isOverlapping('09:00', '13:45', '13:45', '13:46')).toBe(false);
  });

  it('能正确计算时间差换算值', () => {
    // [11:00, 22:00] 每30分钟换算为 1.5
    const data = TimeProcessor.calculateTimeLen('22:00', '11:00', 30, 1.5);
    expect(data).toBe(33);
  });
});