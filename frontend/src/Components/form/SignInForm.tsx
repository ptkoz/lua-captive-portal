/**
 * Component description goes here
 */
import * as React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FormContent } from "./FormContent";

import { connect } from "react-redux";
import { SubmitForm } from "../../actions";
import { withRouter } from "react-router";

/**
 * Props available on this component
 */
export interface ISignInFormProps {
	onSubmit(event: React.FormEvent<Form>): void;
}

/**
 * The component class
 */
class SignInForm extends React.PureComponent<ISignInFormProps, {}> {
	public render(): JSX.Element {
		return (
			<Form onSubmit={this.props.onSubmit}>
				<Row>
					<Col sm={10} smOffset={1} md={6} mdOffset={3}>
						<FormContent />
					</Col>
				</Row>
			</Form>
		);
	}
}

/**
 * Map onSubmit to action dispatcher
 */
const mapDispatchToProps = (dispatch, { history }): ISignInFormProps => ({
	onSubmit: (event: React.FormEvent<Form>): void => {
		event.preventDefault();
		dispatch(new SubmitForm(history));
	}
});

const SignInFormConnected = withRouter(connect<{}, ISignInFormProps, {}>(null, mapDispatchToProps)(SignInForm));
export { SignInFormConnected as SignInForm };
