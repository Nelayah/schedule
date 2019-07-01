var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as R from 'ramda';
import * as React from 'react';
import moment from '../lib/moment-es6';
import connect from '../lib/connect';
const format = v => moment(v).format('HH:mm');
let default_1 = class default_1 extends React.Component {
    shouldComponentUpdate(nextProps) {
        // @ts-ignore
        const isDiff = R.complement(R.eqProps(R.__, nextProps, this.props));
        return ['cellWidth', 'cellHeight', 'className', 'min', 'max'].reduce((prev, key) => prev || isDiff(key), false);
    }
    render() {
        const { className, index, cellWidth, cellHeight, onMouseDown, onMouseOver, rows, min, max } = this.props;
        return (React.createElement("div", { "data-index": index, className: className, style: {
                width: cellWidth,
                height: cellHeight,
                lineHeight: `${cellHeight}px`,
                color: 'white'
            }, onMouseDown: onMouseDown, onMouseOver: onMouseOver }, R.complement(R.isNil)(rows) && min === index && `${format(rows[min].key)} - ${format(rows[max + 1].key)}`));
    }
};
default_1.defaultProps = {
    index: 0,
    onMouseDown: null,
    onMouseOver: null
};
default_1 = __decorate([
    connect
], default_1);
export default default_1;
