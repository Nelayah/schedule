import * as R from 'ramda';
import * as React from 'react';
import * as moment from 'moment';
import {WrappedFormUtils} from 'antd/lib/form/Form';
import 'antd/lib/popover/style/css';
import 'antd/lib/form/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/time-picker/style/css';
import {
  Form,
  Popover,
  Button,
  Input,
  TimePicker,
  Row
} from 'antd';

const {Item: FormItem} = Form;
// moment 对象转时间戳
const toTimestamp: any = R.mapObjIndexed(R.when(moment.isMoment, v => v.valueOf()));
// 时间戳转 moment 对象
const toMoment = R.unless(isNaN, moment);
const compareMoment: any = x => R.cond([
  // @ts-ignore
  [y => R.lt(x.valueOf(), y.valueOf()), R.always('The end time must be grater than the start time.')],
  [y => R.equals(x.format('HH:mm'), y.format('HH:mm')), R.always('The start time should not be equal to the end time')],
  [R.T, R.always(undefined)]
]);
// 更新回调数据的 rowStartKey 和 rowEndKey
const updateRowKeyFunc = data => (k1, k2) => data[k1] = data[k2].format('HH:mm');
// 更新回调数据
const updateCallbackData: any = R.compose(
  toTimestamp,
  (value: any) => {
    const updateRowKey = updateRowKeyFunc(value);
    updateRowKey('rowStartKey', 'startTime');
    updateRowKey('rowEndKey', 'endTime');
    return value;
  }
);

export interface IAppProps {
  form?: WrappedFormUtils;
  visible?: boolean;
  initialValue?: any;
  onOk?: (data?: any) => void;
  onCancel?: () => void;
}

export interface IAppState {
}

// @ts-ignore
@Form.create()
export default class extends React.Component<IAppProps, IAppState> {
  static defaultProps = {
    initialValue: {}
  };
  componentWillReceiveProps(nextProps: IAppProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible === false) nextProps.form.resetFields();
  }
  handleConfirm = () => {
    const {
      form,
      onOk,
      initialValue
    } = this.props;
    form.validateFields((err, value) => {
      if (err) return;
      onOk(updateCallbackData({
        ...initialValue,
        ...value
      }));
    });
  }
  // disabled startTime hours
  handleDisabledStartTimeHours = () => {
    const {form} = this.props;
    const endTime: any = form.getFieldValue('endTime');
    return R.concat(R.range(0, 8), R.range(endTime.hour() + 1, 24));
  }
  // disabled startTime minutes
  handleDisabledStartTimeMinutes = selectedHour => {
    const {form} = this.props;
    const endTime: any = form.getFieldValue('endTime');
    if (selectedHour === endTime.hour()) return R.range(endTime.minute(), 60);
    return [];
  }
  // disabled endTime hours
  handleDisabledEndTimeHours = () => {
    const {form} = this.props;
    const startTime: any = form.getFieldValue('startTime');
    return R.range(0, Math.max(startTime.hour(), 8)).concat(23);
  }
  // disabled endTime minutes
  handleDisabledEndTimeMinutes = selectedHour => {
    const {form} = this.props;
    const startTime: any = form.getFieldValue('startTime');
    if (selectedHour === 22) return R.range(1, 60);
    if (selectedHour === startTime.hour()) return R.range(0, startTime.minute() + 1);
    return [];
  }
  handleTimeChange = (key, value) => {
    const {form} = this.props;
    form.setFieldsValue({[key]: value});
    form.validateFields({force: true});
  }
  handleStartTimeChange = value => {
    this.handleTimeChange('startTime', value);
  }
  handleEndTimeChange = value => {
    this.handleTimeChange('endTime', value);
  }
  get handleFormRender() {
    const {
      form,
      onCancel,
      initialValue
    } = this.props;
    return (
      <Form style={{width: 300}} onSubmit={this.handleConfirm}>
        <Row type="flex" justify="space-between">
          <FormItem label="startTime" style={{width: 128}}>
            {form.getFieldDecorator('startTime', {
              // @ts-ignore
              onChange: this.handleStartTimeChange,
              initialValue: toMoment(initialValue.startTime)
            })(
              <TimePicker
                placeholder="please select"
                minuteStep={15}
                format="HH:mm"
                disabledHours={this.handleDisabledStartTimeHours}
                disabledMinutes={this.handleDisabledStartTimeMinutes}
                hideDisabledOptions
              />
            )}
          </FormItem>
          <FormItem label="endTime" style={{width: 128}}>
            {form.getFieldDecorator('endTime', {
              rules: [
                {validator: (rule, value: moment.Moment, cb: any) => {
                  cb(compareMoment(value)(form.getFieldValue('startTime')));
                }}
              ],
              // @ts-ignore
              onChange: this.handleEndTimeChange,
              initialValue: toMoment(initialValue.endTime)
            })(
              <TimePicker
                placeholder="please select"
                minuteStep={15}
                format="HH:mm"
                disabledHours={this.handleDisabledEndTimeHours}
                disabledMinutes={this.handleDisabledEndTimeMinutes}
                hideDisabledOptions
              />
            )}
          </FormItem>
        </Row>
        <FormItem label="Scheduler Content">
            {form.getFieldDecorator('content', {
              initialValue: initialValue.content
            })(
              <Input placeholder="please input" />
            )}
          </FormItem>
        <Row type="flex" justify="space-between" style={{marginTop: 15}}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">Confirm</Button>
        </Row>
      </Form>
    );
  }
  public render() {
    const {
      children,
      visible
    } = this.props;
    return (
      <Popover
        visible={visible}
        trigger="click"
        placement="left"
        content={visible && this.handleFormRender}
      >
        {children}
      </Popover>
    );
  }
}