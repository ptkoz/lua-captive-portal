/**
 * Component description goes here
 */
import * as React from "react";
import { Alert, FormGroup, HelpBlock, InputGroup } from "react-bootstrap";
import { InputToken } from "./InputToken";
import { InputButton } from "./InputButton";
import { IState } from "../../state";
import { connect } from "react-redux";
import { FadeCollapse } from "../transitions/FadeCollapse";

/**
 * Props available on this component
 */
export interface IFormContentProps {
	hasError: boolean;
	errorMessage: string;
}

/**
 * The component class
 */
class FormContent extends React.PureComponent<IFormContentProps, {}> {
	public render(): JSX.Element {
		return (
			<FormGroup validationState={this.props.hasError ? "error" : null}>
				<InputGroup bsSize="lg">
					<InputToken />
					<InputGroup.Button>
						<InputButton/>
					</InputGroup.Button>
				</InputGroup>
				<HelpBlock>
					<FadeCollapse show={this.props.hasError}>
						<Alert bsStyle="danger">{this.props.errorMessage}</Alert>
					</FadeCollapse>
				</HelpBlock>
			</FormGroup>
		);
	}
}

/**
 * Connect FormContent to state
 */
const mapStateToProps = (state: IState): IFormContentProps => ({
	hasError: state.hasError,
	errorMessage: state.errorMessage
});

const FormContentConnected = connect<IFormContentProps, {}, {}>(mapStateToProps)(FormContent);
export { FormContentConnected as FormContent };