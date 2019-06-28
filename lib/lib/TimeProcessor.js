import * as R from 'ramda';
import * as moment from 'moment';
const TimeProcessor = function (start, end) {
    this.__startTime = TimeProcessor.toMoment(start);
    this.__endTime = TimeProcessor.toMoment(end);
};
TimeProcessor.of = (start, end) => new TimeProcessor(start, end);
// 计算时间分钟差
TimeProcessor.prototype.calculateDiffMinutes = function () {
    return this.__endTime.diff(this.__startTime, 'minutes');
};
// 时间区序列化
TimeProcessor.prototype.serialize = function (timelineInterval) {
    return R.range(0, Math.ceil(this.calculateDiffMinutes() / timelineInterval) + 1).map(i => {
        return moment(this.__startTime).add(timelineInterval * i, 'minutes');
    });
};
// moment 初始化
TimeProcessor.toMoment = value => {
    if (typeof value === 'number')
        return moment(value);
    if (typeof value === 'string')
        return moment(`2000-01-01 ${value}`);
    return value;
};
// 转时间戳
TimeProcessor.toTimestamp = value => {
    // moment 对象转时间戳
    if (moment.isMoment(value))
        return value.valueOf();
    // "HH:mm" 字符串转时间戳
    if (typeof value === 'string')
        return TimeProcessor.toMoment(value).valueOf();
    return value;
};
// 判断两个时间段是否重叠
TimeProcessor.isOverlapping = (xStart, xEnd, yStart, yEnd) => {
    return Math.max(TimeProcessor.toTimestamp(xStart), TimeProcessor.toTimestamp(yStart)) < Math.min(TimeProcessor.toTimestamp(xEnd), TimeProcessor.toTimestamp(yEnd));
};
// 时间差换算长度
TimeProcessor.calculateTimeLen = (x, y, interval, len) => {
    return Math.round((TimeProcessor.toTimestamp(x) - TimeProcessor.toTimestamp(y)) / 60 / 1000 / interval * len);
};
export default TimeProcessor;
