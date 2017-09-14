/**
 * Component description goes here
 */
import * as React from "react";
import { Button, Col, Jumbotron, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

/**
 * Props available on this component
 */
export interface IError404Props {

}

/**
 * The component class
 */
export class Error404 extends React.PureComponent<IError404Props, {}> {
	public render(): JSX.Element {
		return (
			<div>
				<Jumbotron>
					<div className="container">
						<h1>404 - strony nie znaleziono.</h1>
						<p>Niestety, strona którą próbujesz wyświetlić nie jest dostępna w naszym portalu. Wybierz inny element z menu lub wróć do strony logowania.</p>
						<p>Pamiętaj, że jeśli próbujesz zrobić coś brzydkiego, to Igor automatycznie powiadomi najbliższy posterunek policji!</p>
						<Row>
							<Col sm={6} smOffset={3}>
								<LinkContainer to="/" exact={true}>
									<Button block={true} bsSize="large">Wróć do strony logowania</Button>
								</LinkContainer>
							</Col>
						</Row>
					</div>
				</Jumbotron>
			</div>
		);
	}
}