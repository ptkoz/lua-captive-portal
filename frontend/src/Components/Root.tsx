/**
 * Component description goes here
 */
import * as React from "react";
import DocumentMeta from "react-document-meta";
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
export interface IRootProps {
}

/**
 * The component class
 */
class Root extends React.PureComponent<IRootProps & RouteComponentProps & WithTranslation, {}> {
	public componentDidMount() {
		// Translate document title
		document.title = this.props.t("FC Visitors - Captive Portal");
		// Translate description meta element
		let descEl: HTMLMetaElement = document.querySelector("meta[name=\"description\"]");
		if (!descEl) {
			descEl = document.createElement("meta");
			descEl.setAttribute("name", "description");
			document.head.appendChild(descEl);
		}
		descEl.setAttribute("content", this.props.t("FC visitors captive portal"));
		// Translate author meta element
		let authEl: HTMLMetaElement = document.querySelector("meta[name=\"author\"]");
		if (!authEl) {
			authEl = document.createElement("meta");
			authEl.setAttribute("name", "author");
			document.head.appendChild(authEl);
		}
		authEl.setAttribute("content", this.props.t("AUTHOR") + this.props.t("AUTHOR_SUFFIX"));
	}

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
						<p>&copy; {this.props.t("AUTHOR")} {(new Date()).getFullYear()} {this.props.t("AUTHOR_SUFFIX")}</p>
					</footer>
				</div>
			</div>
		);
	}
}

const RootWithRouter = withRouter(Root);
const RootWithI18n = withTranslation()(RootWithRouter);
export { RootWithI18n as Root };
