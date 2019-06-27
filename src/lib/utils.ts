import * as R from 'ramda';
import * as md5 from 'blueimp-md5';
import TimeProcessor from './TimeProcessor';

export const defaultArray: any = R.defaultTo([]);

// 列项极限参考值值
export const MAX_REF_NUMBER = 2000;
// 对于时间段交叉部分计算
export const countOverlaps = times => {
  const len = times.length;
  let tracks = 0;
  R.range(0, len).forEach(i => {
    R.range(i + 1, len).forEach(j => {
      if (times[i]._endTime <= times[j]._startTime) return;
      if (times[j]._track === times[i]._track) {
        times[j]._track++;
        tracks = Math.max(tracks, times[j]._track);
      }
      times[j]._overlay.push({_track: times[i]._track});
      times[i]._overlay.push({_track: times[j]._track});
    });
  });
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
        _overlay: [],
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
// 计算缓存 key 值
export const calculateCache: any = R.compose(
  md5,
  JSON.stringify,
  R.map(R.pick(['colKey', 'rowEndKey', 'rowStartKey'])),
  R.sort((x: any, y: any) => TimeProcessor.toTimestamp(x.rowStartKey) - TimeProcessor.toTimestamp(y.rowStartKey)),
  defaultArray
);
// 用缓存更新现有值
export const updateCacheFunc: any = cache => data => {
  return cache.map((v, i) => {
    return {
      ...R.pick(['_startTime', '_endTime', '_proportion', '_track', '_overlay', '_minimum'])(v),
      ...data[i]
    };
  });
};