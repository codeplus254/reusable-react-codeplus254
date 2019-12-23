import React from 'react';
import TextInputCSSModules from 'reusable-react-codeplus254/TextInputCSSModules';

/** Required TextBox with error */
export default class ExampleError extends React.Component {
    render() {
        return (
            <TextInputCSSModules
                htmlId="example-optional"
                label="First Name"
                name="firstname"
                onChange={() => {}}
                required
                error=" First name is required."
                />
        )
    }
}