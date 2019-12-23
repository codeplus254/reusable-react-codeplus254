import React from 'react';
import RegistrationForm from 'reusable-react-codeplus254/RegistrationForm';
import { render } from 'react-dom';

export default class ExampleRegistrationForm extends React.Component {
    onSubmit = (user) => {
        console.log(user);
    }

    render() {
        return <RegistrationForm onSubmit={this.onSubmit} />
    }
}