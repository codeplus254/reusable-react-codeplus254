import React from 'react';
import TextInputStyledComponents from 'reusable-react-codeplus254/TextInputStyledComponents';

/** Required TextBox with error */
export default class ExampleError extends React.Component {
    render() {
        return (
            <TextInputStyledComponents
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