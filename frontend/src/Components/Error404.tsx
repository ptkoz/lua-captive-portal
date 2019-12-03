/**
 * Component description goes here
 */
import * as React from "react";
import { Button, Col, Jumbotron, Row } from "react-bootstrap";
import { withTranslation, WithTranslation } from "react-i18next";
import { LinkContainer } from "react-router-bootstrap";

/**
 * Props available on this component
 */
export interface IError404Props {

}

/**
 * The component class
 */
class Error404 extends React.PureComponent<IError404Props & WithTranslation, {}> {
	public render(): JSX.Element {
		return (
			<div>
				<Jumbotron>
					<div className="container">
						<h1>{this.props.t("404 - Page Not Found.")}</h1>
						<p>{this.props.t("Unfortunately, the page you are trying to view is not available on our portal. Choose another item from the menu or return to the login page.")}</p>
						<p>{this.props.t("Remember that if you try to do something ugly, Igor will automatically notify the nearest police station!")}</p>
						<Row>
							<Col sm={6} smOffset={3}>
								<LinkContainer to="/" exact={true}>
									<Button block={true} bsSize="large">{this.props.t("Return to login page")}</Button>
								</LinkContainer>
							</Col>
						</Row>
					</div>
				</Jumbotron>
			</div>
		);
	}
}

const Error404WithI18n = withTranslation()(Error404);
export { Error404WithI18n as Error404 };
