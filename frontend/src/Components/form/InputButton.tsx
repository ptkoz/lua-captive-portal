/**
 * Component description goes here
 */
import * as React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { IState } from "../../state";

/**
 * Props available on this component
 */
interface IInputButtonProps extends WithTranslation {
	isLoading: boolean;
}

/**
 * The component class
 */
class InputButton extends React.PureComponent<IInputButtonProps, {}> {
	public render(): JSX.Element {
		let indicator: JSX.Element = null;

		if (this.props.isLoading) {
			indicator = <span className="indicator"><span className="glyphicon glyphicon-refresh glyphicon-refresh-animate pull-left" /></span>;
		}

		return 	<Button type="submit" bsStyle="primary" style={{width: "15rem"}} disabled={this.props.isLoading} className="button-loading">{indicator}{this.props.t("Next")}</Button>;

	}
}

/**
 * Connect InputButton to state
 */
const mapStateToProps = (state: IState): Partial<IInputButtonProps> => ({
	isLoading: state.isLoading
});

const InputButtonConnected = connect<Partial<IInputButtonProps>, {}, {}>(mapStateToProps)(InputButton);
const InputButtonWithI18n = withTranslation()(InputButtonConnected);
export { InputButtonWithI18n as InputButton };
