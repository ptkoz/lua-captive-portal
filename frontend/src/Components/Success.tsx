/**
 * Component description goes here
 */
import * as React from "react";
import { Jumbotron } from "react-bootstrap";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * Props available on this component
 */
export interface ISuccessProps {

}

/**
 * The component class
 */
class Success extends React.PureComponent<ISuccessProps & WithTranslation, {}> {
	public render(): JSX.Element {
		return (
			<Jumbotron>
				<div className="container">
					<h1>{this.props.t("Congratulations")}</h1>
					<p className="lead text-justify">{this.props.t("You can now use the internet.")}</p>
				</div>
			</Jumbotron>
		);
	}
}

const SuccessWithI18n = withTranslation()(Success);
export { SuccessWithI18n as Success };
