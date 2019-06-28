import * as React from 'react';
import * as PropTypes from 'prop-types';
import { withContext } from 'recompose';
// 配合 @decorator/connect 使用
// 仿 React Context，可以提供局部 Context
export default withContext({ stores: PropTypes.object }, props => ({ stores: props })
// @ts-ignore
)(props => React.Children.only(props.children));
