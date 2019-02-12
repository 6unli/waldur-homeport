import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { withTranslation, TranslateProps } from '@waldur/i18n';
import ActionButton from '@waldur/table-react/ActionButton';

import { orderCanBeApproved } from '../orders/store/selectors';
import { OrderItemResponse } from '../orders/types';
import { createOrderRequest } from './store/actions';
import { getItems, isCreatingOrder } from './store/selectors';
import { OuterState } from './types';

interface ForwardButtonComponentProps extends TranslateProps {
  createOrder(): void;
  items: OrderItemResponse[];
  disabled: boolean;
  orderCanBeApproved: boolean;
}

interface PureForwardButton {
  title: string;
  action(state?: number): void;
  disabled: boolean;
  tooltip?: string;
}

export const PureForwardButton = (props: PureForwardButton) => (
  <ActionButton
    title={props.title}
    icon="fa fa-arrow-right"
    className="btn btn-primary"
    action={props.action}
    disabled={props.disabled}
    tooltip={props.tooltip}
  />
);

const ForwardButtonComponent = (props: ForwardButtonComponentProps) =>
  props.items.length > 0 ?
    props.orderCanBeApproved ? (
      <PureForwardButton
        title={props.translate('Purchase')}
        action={props.createOrder}
        disabled={props.disabled}
        tooltip={props.translate('You have the right to purchase service without additional approval.')}
      />
    ) : (
      <PureForwardButton
        title={props.translate('Request an approval')}
        action={props.createOrder}
        disabled={props.disabled}
      />
    ) : null;

const mapStateToProps = (state: OuterState) => ({
  items: getItems(state),
  disabled: isCreatingOrder(state),
  orderCanBeApproved: orderCanBeApproved(state),
});

const enhance = compose(
  connect(mapStateToProps, {createOrder: createOrderRequest}),
  withTranslation,
);

export const ForwardButton = enhance(ForwardButtonComponent) as React.ComponentClass<{}>;
