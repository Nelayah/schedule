declare const TimeProcessor: {
    (start: any, end: any): void;
    of(start: any, end: any): any;
    toMoment(value: any): any;
    toTimestamp(value: any): any;
    isOverlapping(xStart: any, xEnd: any, yStart: any, yEnd: any): boolean;
    calculateTimeLen(x: any, y: any, interval: any, len: any): number;
};
export default TimeProcessor;
