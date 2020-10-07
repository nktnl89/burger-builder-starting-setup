import React, { Component } from 'react';
import axios from '../../axios-orders';

import Aux from '../../hoc/Aux_';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGRIDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingridients: null,
        totalPrice: 4,
        purchasable: false,
        orderClicked: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        axios.get('https://react-burger-builder-39862.firebaseio.com/ingridients.json')
            .then(response => {
                this.setState({ ingridients: response.data })
            })
            .catch(error => {
                this.setState({ error: true })
            });
    }

    updatePurchaseState(ingridients) {
        const sum = Object.keys(ingridients)
            .map(igKey => {
                return ingridients[igKey]
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({ purchasable: sum > 0 });
    }

    addIngridientHandler = (type) => {
        const oldCount = this.state.ingridients[type];
        const updatedCount = oldCount + 1;
        const updatedIngridients = {
            ...this.state.ingridients
        };
        updatedIngridients[type] = updatedCount;
        const priceAddition = INGRIDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPrice,
            ingridients: updatedIngridients
        });
        this.updatePurchaseState(updatedIngridients);
    };

    removeIngridientHandler = (type) => {
        const oldCount = this.state.ingridients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngridients = {
            ...this.state.ingridients
        };
        updatedIngridients[type] = updatedCount;
        const priceDeduction = INGRIDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({
            totalPrice: newPrice,
            ingridients: updatedIngridients
        });
        this.updatePurchaseState(updatedIngridients);
    };

    orderClickedHandler = () => {
        this.setState({ orderClicked: true });
    }

    orderCancelHandler = () => {
        this.setState({ orderClicked: false })
    }

    orderContinueHandler = () => {
        this.setState({ loading: true });
        //alert('You continue!');
        const order = {
            ingridients: this.state.ingridients,
            price: this.state.totalPrice,
            customer: {
                name: 'sergey alekseev',
                address: {
                    street: 'venkskaya',
                    house: 45,
                    country: 'Udmurt Republic'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        };

        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false, orderClicked: false });
            })
            .catch(error => {
                this.setState({ loading: false, orderClicked: false })
            });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingridients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null

        let burger = this.state.error ? <p>Ingridients can't be loaded!</p> : <Spinner />;

        if (this.state.ingridients) {
            burger = (
                <Aux>
                    <Burger ingridients={this.state.ingridients} />
                    <BuildControls
                        ingridientAdded={this.addIngridientHandler}
                        ingridientRemoved={this.removeIngridientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.orderClickedHandler}
                        price={this.state.totalPrice}
                    />
                </Aux>);
            orderSummary = <OrderSummary
                purchaseCancelled={this.orderCancelHandler}
                purchaseContinued={this.orderContinueHandler}
                ingridients={this.state.ingridients}
                price={this.state.totalPrice}
            />;
        }
        if (this.state.loading) {
            orderSummary = <Spinner />;
        }
        return (
            <Aux>
                <Modal show={this.state.orderClicked} modalClosed={this.orderCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>

        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);