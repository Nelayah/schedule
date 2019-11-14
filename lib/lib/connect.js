var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { getContext, mapProps, compose, toClass, hoistStatics } from 'recompose';
const enhance = compose(
// 无状态功能组件无法提供参考
// Function components cannot be given refs
toClass, getContext({ stores: PropTypes.object }), mapProps((props) => (Object.assign(Object.assign({}, props.stores), props))));
// @ts-ignore
export default Component => hoistStatics(enhance)((_a) => {
    var { forwardedRef } = _a, rest = __rest(_a, ["forwardedRef"]);
    return React.createElement(Component, Object.assign({ ref: forwardedRef }, rest));
});
