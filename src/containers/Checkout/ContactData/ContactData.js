import React, { Component } from 'react';
import axios from '../../../axios-orders';
import classes from './ContactData.css';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    elementType(elementType, configType, configPlaceholder, defaultValue, options, validationRules) {
        return {
            elementType: elementType,
            elementConfig: {
                type: configType,
                placeholder: configPlaceholder,
                options: options
            },
            value: defaultValue,
            validation: validationRules,
            valid: false,
            touched: false
        }
    }

    state = {
        orderForm: {
            name: this.elementType('input',
                'text',
                'Your Name',
                '',
                null,
                { required: true, minLength: 3 }),
            street: this.elementType('input', 'text', 'Street', '', null, { required: true }),
            zipcode: this.elementType('input', 'text', 'ZIP Code', '', null, { required: true, minLength: 6, maxLength: 6 }),
            country: this.elementType('input', 'text', 'Country', '', null, { required: true }),
            email: this.elementType('input', 'email', 'Your Email', '', null, { required: true }),
            deliveryMethod: this.elementType('select', 'text', null, 'fastest',
                [
                    { value: 'fastest', displayValue: 'Fastest' },
                    { value: 'cheapest', displayValue: 'Cheapest' }
                ],
                { required: true }
            )
        },
        loading: false,
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const formData = {};
        for (let formElementId in this.state.orderForm) {
            formData[formElementId] = this.state.orderForm[formElementId].value;
        }
        const order = {
            ingridients: this.props.ingridients,
            price: this.props.price,
            orderData: formData
        };

        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false });
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({ loading: false })
            });
    }

    checkValidation(value, rules) {
        let isValid = true;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidation(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (<form onSubmit={this.orderHandler}>
            {formElementsArray.map(formElement => (
                <Input key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    invalid={!formElement.config.valid}
                    value={formElement.config.value}
                    touched={formElement.config.touched}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    shouldValidate={formElement.config.validation} />
            ))}
            <Button buttonType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
        </form>);
        if (this.state.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;