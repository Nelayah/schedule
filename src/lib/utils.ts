import * as R from 'ramda';
import TimeProcessor from './TimeProcessor';

export const defaultArray: any = R.defaultTo([]);

// 列项极限参考值值
export const MAX_REF_NUMBER = 2000;
// 对于时间段交叉部分计算
export const countOverlaps = times => {
  const len = times.length;
  let tracks = 0;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (times[i]._endTime > times[j]._startTime) {
        times[j]._overlayIndex.push(i);
        times[i]._overlayIndex.push(j);
        times[j]._disabledTrack.push(times[i]._track);
        while (times[j]._disabledTrack.includes(times[j]._track)) {
          times[j]._track++;
          tracks = Math.max(tracks, times[j]._track);
        }
      } else break;
    }
  }
  for (let i = 0; i < len; i++) times[i]._overlay = times[i]._overlayIndex.map(k => ({_track: times[k]._track}));
  return ({
    times,
    tracks
  });
};
// 对源数据预处理 pre-processing
export const preProcessing: any = R.compose(
  countOverlaps,
  R.sort((x: any, y: any) => x._startTime - y._startTime),
  R.map((v: any) => {
    return R.compose(
      R.mergeDeepLeft({
        _track: 0,
        _disabledTrack: [],
        _overlay: [],
        _overlayIndex: [],
        _startTime: TimeProcessor.toTimestamp(v.rowStartKey),
        _endTime: TimeProcessor.toTimestamp(v.rowEndKey)
      })
    )(v);
  })
);
// 找出重叠区域最近右边区域
export const findTheMinimumGreater = v => R.compose(
  R.reduce(R.min, MAX_REF_NUMBER),
  // @ts-ignore
  R.filter(R.gt(R.__, v._track)),
  R.pluck('_track'),
  R.prop('_overlay')
)(v);