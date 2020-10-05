import React, { Component } from 'react';

import Aux from '../../../hoc/Aux_';
import Button from '../../UI/Button/Button';


class OrderSummary extends Component {
    componentDidUpdate() {
        console.log('[OrderSummary] DidUpdate');
    }

    render() {
        const ingridientSummary = Object.keys(this.props.ingridients)
            .map(igKey => {
                return (
                    <li key={igKey}>
                        <span style={{ textTransform: 'capitalize' }}>{igKey}</span>: {this.props.ingridients[igKey]}
                    </li>
                );
            });
        return (<Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following ingridients:</p>
            <ul>
                {ingridientSummary}
            </ul>
            <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
            <p>Continue to Checkout?</p>
            <Button buttonType="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
            <Button buttonType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
        </Aux>);
    }
}

export default OrderSummary;