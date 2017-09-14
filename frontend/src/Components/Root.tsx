/**
 * Component description goes here
 */
import * as React from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";
import { FadeResizeReplace } from "./transitions/FadeResizeReplace";
import { Location } from "history";
import { Content } from "./Content";

/**
 * Props available on this component
 */
export interface IRootProps {
	location?: Location;
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
								<a href="/" className="navbar-brand">FC Goście</a>
							</LinkContainer>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav pullRight={true}>
							<LinkContainer to="/" exact={true}>
								<NavItem eventKey={1}>Logowanie</NavItem>
							</LinkContainer>
							<LinkContainer to="/motivation">
								<NavItem eventKey={2}>Dlaczego token zamiast hasła</NavItem>
							</LinkContainer>
							<LinkContainer to="/geekness">
								<NavItem eventKey={3}>Że też Ci się chciało</NavItem>
							</LinkContainer>
						</Nav>
					</Navbar.Collapse>
				</Navbar>

				<FadeResizeReplace>
					<Route location={this.props.location} key={this.props.location.key} component={Content} />
				</FadeResizeReplace>

				<div className="container">
					<hr/>
					<footer>
						<p>&copy; Patryk Kozłowski {(new Date()).getFullYear()}</p>
					</footer>
				</div>
			</div>
		);
	}
}

const RootWithRouter = withRouter(Root);
export { RootWithRouter as Root };