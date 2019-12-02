/**
 * Component description goes here
 */
import * as React from "react";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Alert, FormGroup, HelpBlock, InputGroup } from "react-bootstrap";
import { InputToken } from "./InputToken";
import { InputButton } from "./InputButton";
import { IState } from "../../state";
import { PureFade } from "../transitions/PureFade";

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
class FormContent extends React.PureComponent<IFormContentProps & WithTranslation, {}> {
	public render(): JSX.Element {
		return (
			<FormGroup validationState={this.props.hasError ? "error" : null}>
				<InputGroup bsSize="lg">
					<InputToken placeholder={this.props.t("Enter your token")}/>
					<InputGroup.Button>
						<InputButton/>
					</InputGroup.Button>
				</InputGroup>
				<HelpBlock>
					<PureFade show={this.props.hasError}>
						<Alert bsStyle="danger">{this.props.errorMessage}</Alert>
					</PureFade>
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

const FormContentWithI18n = withTranslation()(FormContent);
const FormContentConnected = connect<IFormContentProps, {}, {}>(mapStateToProps)(FormContentWithI18n);
export { FormContentConnected as FormContent };
