import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  getContext,
  mapProps,
  compose,
  toClass,
  hoistStatics
} from 'recompose';

const enhance: any = compose(
  // 无状态功能组件无法提供参考
  // Function components cannot be given refs
  toClass,
  getContext(
    { stores: PropTypes.object }
  ),
  mapProps((props: any) => ({...props.stores, ...props}))
);
// @ts-ignore
export default Component => hoistStatics(enhance)(({forwardedRef, ...rest}) => <Component ref={forwardedRef} {...rest} />) as any;
