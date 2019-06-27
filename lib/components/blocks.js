var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import connect from '../lib/connect';
import { prefixCls } from '../index';
let default_1 = class extends React.Component {
    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data) || nextProps.unit !== this.props.unit;
    }
    get style() {
        const { data, forbidden, top, height, unit } = this.props;
        return ({
            position: 'absolute',
            top,
            left: data._track * unit + 1,
            width: data._proportion * unit - 2,
            height,
            cursor: !forbidden ? 'pointer' : 'not-allowed'
        });
    }
    render() {
        const { data, selectedDataFaCC } = this.props;
        return (React.createElement("div", { className: `${prefixCls}-arrangement`, style: this.style }, selectedDataFaCC && selectedDataFaCC(data)));
    }
};
default_1 = __decorate([
    connect
], default_1);
export default default_1;
