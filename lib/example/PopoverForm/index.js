var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as R from 'ramda';
import * as React from 'react';
import moment from '../../lib/moment-es6';
import 'antd/lib/popover/style/css';
import 'antd/lib/form/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/time-picker/style/css';
import { Form, Popover, Button, Input, TimePicker, Row } from 'antd';
const { Item: FormItem } = Form;
// moment 对象转时间戳
const toTimestamp = R.mapObjIndexed(R.when(moment.isMoment, v => v.valueOf()));
// 时间戳转 moment 对象
const toMoment = R.unless(isNaN, moment);
const compareMoment = x => R.cond([
    // @ts-ignore
    [y => R.lt(x.valueOf(), y.valueOf()), R.always('The end time must be grater than the start time.')],
    [y => R.equals(x.format('HH:mm'), y.format('HH:mm')), R.always('The start time should not be equal to the end time')],
    [R.T, R.always(undefined)]
]);
// 更新回调数据的 rowStartKey 和 rowEndKey
const updateRowKeyFunc = data => (k1, k2) => data[k1] = data[k2].format('HH:mm');
// 更新回调数据
const updateCallbackData = R.compose(toTimestamp, (value) => {
    const updateRowKey = updateRowKeyFunc(value);
    updateRowKey('rowStartKey', 'startTime');
    updateRowKey('rowEndKey', 'endTime');
    return value;
});
// @ts-ignore
let default_1 = class default_1 extends React.Component {
    constructor() {
        super(...arguments);
        this.handleConfirm = () => {
            const { form, onOk, initialValue } = this.props;
            form.validateFields((err, value) => {
                if (err)
                    return;
                onOk(updateCallbackData(Object.assign(Object.assign({}, initialValue), value)));
            });
        };
        // disabled startTime hours
        this.handleDisabledStartTimeHours = () => {
            const { form } = this.props;
            const endTime = form.getFieldValue('endTime');
            return R.concat(R.range(0, 8), R.range(endTime.hour() + 1, 24));
        };
        // disabled startTime minutes
        this.handleDisabledStartTimeMinutes = selectedHour => {
            const { form } = this.props;
            const endTime = form.getFieldValue('endTime');
            if (selectedHour === endTime.hour())
                return R.range(endTime.minute(), 60);
            return [];
        };
        // disabled endTime hours
        this.handleDisabledEndTimeHours = () => {
            const { form } = this.props;
            const startTime = form.getFieldValue('startTime');
            return R.range(0, Math.max(startTime.hour(), 8)).concat(23);
        };
        // disabled endTime minutes
        this.handleDisabledEndTimeMinutes = selectedHour => {
            const { form } = this.props;
            const startTime = form.getFieldValue('startTime');
            if (selectedHour === 22)
                return R.range(1, 60);
            if (selectedHour === startTime.hour())
                return R.range(0, startTime.minute() + 1);
            return [];
        };
        this.handleTimeChange = (key, value) => {
            const { form } = this.props;
            form.setFieldsValue({ [key]: value });
            form.validateFields({ force: true });
        };
        this.handleStartTimeChange = value => {
            this.handleTimeChange('startTime', value);
        };
        this.handleEndTimeChange = value => {
            this.handleTimeChange('endTime', value);
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== this.props.visible && nextProps.visible === false)
            nextProps.form.resetFields();
    }
    get handleFormRender() {
        const { form, onCancel, initialValue } = this.props;
        return (React.createElement(Form, { style: { width: 260 }, onSubmit: this.handleConfirm },
            React.createElement(Row, { type: "flex", justify: "space-between" },
                React.createElement(FormItem, { label: "startTime", style: { width: 128 } }, form.getFieldDecorator('startTime', {
                    // @ts-ignore
                    onChange: this.handleStartTimeChange,
                    initialValue: toMoment(initialValue.startTime)
                })(React.createElement(TimePicker, { placeholder: "please select", minuteStep: 15, format: "HH:mm", disabledHours: this.handleDisabledStartTimeHours, disabledMinutes: this.handleDisabledStartTimeMinutes, hideDisabledOptions: true }))),
                React.createElement(FormItem, { label: "endTime", style: { width: 128 } }, form.getFieldDecorator('endTime', {
                    rules: [
                        { validator: (_, value, cb) => {
                                cb(compareMoment(value)(form.getFieldValue('startTime')));
                            } }
                    ],
                    // @ts-ignore
                    onChange: this.handleEndTimeChange,
                    initialValue: toMoment(initialValue.endTime)
                })(React.createElement(TimePicker, { placeholder: "please select", minuteStep: 15, format: "HH:mm", disabledHours: this.handleDisabledEndTimeHours, disabledMinutes: this.handleDisabledEndTimeMinutes, hideDisabledOptions: true })))),
            React.createElement(FormItem, { label: "Schedule Content" }, form.getFieldDecorator('content', {
                initialValue: initialValue.content
            })(React.createElement(Input, { placeholder: "please input" }))),
            React.createElement(Row, { type: "flex", justify: "space-between", style: { marginTop: 15 } },
                React.createElement(Button, { onClick: onCancel }, "Cancel"),
                React.createElement(Button, { type: "primary", htmlType: "submit" }, "Confirm"))));
    }
    render() {
        const { children, visible } = this.props;
        return (React.createElement(Popover, { visible: visible, trigger: "click", placement: "left", content: visible && this.handleFormRender }, children));
    }
};
default_1.defaultProps = {
    initialValue: {}
};
default_1 = __decorate([
    Form.create()
], default_1);
export default default_1;
