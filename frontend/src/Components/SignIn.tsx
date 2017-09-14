/**
 * Component description goes here
 */
import * as React from "react";
import { Button, Col, Glyphicon, Jumbotron, Row } from "react-bootstrap";
import { SignInForm } from "./form/SignInForm";
import { PureCollapse } from "./transitions/PureCollapse";

/**
 * Props available on this component
 */
interface ISignInProps {

}

interface ISignInState {
	details: boolean;
}

/**
 * The component class
 */
export class SignIn extends React.PureComponent<ISignInProps, ISignInState> {
	public constructor(props) {
		super(props);

		this.state = {
			details: false
		};
	}

	public render(): JSX.Element {
		return (
			<div>
				<Jumbotron>
					<div className="container">
						<h1>Podaj token</h1>
						<p className="lead text-justify">Aby uzyskać dostęp do internetu musisz wygenerować i podać w poniższym formularzu specjalny token.</p>
						<SignInForm />
						<p className="text-justify">Tokenizer znajduje się na komodzie w przedpokoju. Jeżeli potrzebujesz pomocy, poproś o nią któregoś z domowników (Tosia też potrafi wygenerować token, wystarczy podnieść ją na wysokość routera - będzie wiedziała co robić dalej).</p>
					</div>
				</Jumbotron>
				<div className="container">
					<PureCollapse show={this.state.details}>
						<Row>
							<Col md={4}>
								<h2>Użyj przycisku</h2>
								<p><img src="/images/step1.jpg" style={{ width: "100%" }} /></p>
								<p className="text-justify">W przedpokoju obok routera znajduje się małe, białe pudełko z zielonym przyciskiem. Kiedy wciśniesz przycisk, urządzenie wygeneruje i wyświetli token przygotowany specjalnie dla Ciebie.</p>
							</Col>
							<Col md={4}>
								<h2>Przepisz token</h2>
								<p><img src="/images/step2.jpg" style={{ width: "100%" }} /></p>
								<p className="text-justify">Przepisz wygenerowany token do formularza znajdującego się powyżej. Pośpiesz się, token wyświetla się tylko 10 sekund!</p>
							</Col>
							<Col md={4}>
								<h2>Gotowe!</h2>
								<p><img src="/images/step3.jpg" style={{ width: "100%" }} /></p>
								<p className="text-justify">Ciesz się łatwym dostępem do internetu w naszym domu. :-)</p>
							</Col>
						</Row>
					</PureCollapse>
					<Row>
						<Col sm={6} smOffset={3}>
							<Button block={true} bsSize="large" onClick={this.toggleDetails}>{this.state.details ? "Ukryj" : "Pokaż"} instrukcję <Glyphicon glyph={this.state.details ? "chevron-up" : "chevron-down"} style={{ fontSize: "70%", fontWeight: 300, marginLeft: "5px" }}/></Button>
						</Col>
					</Row>
				</div>
			</div>
		);
	}

	private toggleDetails = (event: React.MouseEvent<Button>): void => {
		event.preventDefault();
		this.setState({ details: !this.state.details });
	}
}