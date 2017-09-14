/**
 * Component description goes here
 */
import * as React from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Route } from "react-router-dom";
import { Geekness } from "./Geekness";

/**
 * Props available on this component
 */
export interface IRootProps {

}

/**
 * The component class
 */
export class Root extends React.PureComponent<IRootProps, {}> {
	public render(): JSX.Element {
		return (
			<div style={{paddingTop: "50px"}}>
				<Navbar collapseOnSelect inverse fixedTop>
					<Navbar.Header>
						<Navbar.Brand>
							<LinkContainer to="/" exact>
								<a href="/" className="navbar-brand">FC Goście</a>
							</LinkContainer>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav pullRight>
							<LinkContainer to="/" exact>
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

				<Route path="/" exact component={Geekness}/>
				<Route path="/geekness" component={Geekness}/>

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