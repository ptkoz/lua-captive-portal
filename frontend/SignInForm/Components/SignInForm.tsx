/**
 * Component description goes here
 */
import * as React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FormControl } from "./FormControl";

/**
 * Props available on this component
 */
export interface ISignInFormProps {

}

/**
 * The component class
 */
export class SignInForm extends React.PureComponent<ISignInFormProps, {}> {
	public render(): JSX.Element {
		return (
			<Form style={{marginTop: "3em", marginBottom: "3em"}}>
				<Row>
					<Col sm={10} smOffset={1} md={6} mdOffset={3}>
						<FormControl/>
					</Col>
				</Row>
			</Form>
		);
	}
}