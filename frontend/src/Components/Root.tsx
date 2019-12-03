/**
 * Component description goes here
 */
import * as React from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Route } from "react-router-dom";
import { withRouter, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from "react-i18next";
import { Content } from "./Content";
import { FadeReplace } from "./transitions/FadeReplace";

/**
 * Props available on this component
 */
export interface IRootProps extends RouteComponentProps, WithTranslation {
}

/**
 * The component class
 */
class Root extends React.PureComponent<IRootProps, {}> {
	public render(): JSX.Element {
		return (
			<div style={{paddingTop: "50px"}}>
				<Navbar collapseOnSelect={true} inverse={true} fixedTop={true}>
					<Navbar.Header>
						<Navbar.Brand>
							<LinkContainer to="/" exact={true}>
								<a href="/" className="navbar-brand">{this.props.t("FC Visitors")}</a>
							</LinkContainer>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav pullRight={true}>
							<LinkContainer to="/" exact={true}>
								<NavItem eventKey={1}>{this.props.t("Log in")}</NavItem>
							</LinkContainer>
							<LinkContainer to="/motivation">
								<NavItem eventKey={2}>{this.props.t("Why token instead of password")}</NavItem>
							</LinkContainer>
							<LinkContainer to="/geekness">
								<NavItem eventKey={3}>{this.props.t("That you also wanted to know")}</NavItem>
							</LinkContainer>
						</Nav>
					</Navbar.Collapse>
				</Navbar>

				<FadeReplace>
					<Route location={this.props.location} key={this.props.location.key}>
						<Content/>
					</Route>
				</FadeReplace>

				<div className="container">
					<hr/>
					<footer>
						<p>&copy; Patryk Kozłowski {(new Date()).getFullYear()} {this.props.t("FOOTER_SUFFIX")}</p>
					</footer>
				</div>
			</div>
		);
	}
}

const RootWithRouter = withRouter(Root);
const RootWithI18n = withTranslation()(RootWithRouter);
export { RootWithI18n as Root };
