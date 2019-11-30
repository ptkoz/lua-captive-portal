/**
 * Component description goes here
 */
import * as React from "react";
import { Button, Col, Glyphicon, Jumbotron, Row } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";
import { SignInForm } from "./form/SignInForm";
import { PureCollapse } from "./transitions/PureCollapse";

/**
 * Props available on this component
 */
interface ISignInProps extends WithTranslation {

}

interface ISignInState {
	details: boolean;
}

/**
 * The component class
 */
class SignIn extends React.PureComponent<ISignInProps, ISignInState> {
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
						<h1>{this.props.t("Enter the token")}</h1>
						<p className="lead text-justify">{this.props.t("To access the internet you must generate and enter a special token in the form below.")}</p>
						<SignInForm />
						<p className="text-justify">{this.props.t("The tokenizer is on the dresser in the hall. If you need help, ask one of the household members for it (Tosia can also generate a token, just raise it to the height of the router - it will know what to do next).")}</p>
					</div>
				</Jumbotron>
				<div className="container">
					<PureCollapse show={this.state.details}>
						<Row>
							<Col md={4}>
								<h2>{this.props.t("Use the button")}</h2>
								<p><img src="/images/step1.jpg" style={{ width: "100%" }} /></p>
								<p className="text-justify">{this.props.t("In the hall next to the router is a small white box with a green button. When you press the button, the device will generate and display a token prepared especially for you.")}</p>
							</Col>
							<Col md={4}>
								<h2>{this.props.t("Rewrite the token")}</h2>
								<p><img src="/images/step2.jpg" style={{ width: "100%" }} /></p>
								<p className="text-justify">{this.props.t("Enter the generated token into the form above. Hurry up, the token displays only 10 seconds!")}</p>
							</Col>
							<Col md={4}>
								<h2>{this.props.t("Ready!")}</h2>
								<p><img src="/images/step3.jpg" style={{ width: "100%" }} /></p>
								<p className="text-justify">{this.props.t("Enjoy easy internet access in our home.")}</p>
							</Col>
						</Row>
					</PureCollapse>
					<Row>
						<Col sm={6} smOffset={3}>
							<Button block={true} bsSize="large" onClick={this.toggleDetails}>{this.props.t(this.state.details ? "Hide instruction" : "Show instruction")}<Glyphicon glyph={this.state.details ? "chevron-up" : "chevron-down"} style={{ fontSize: "70%", fontWeight: 300, marginLeft: "5px" }}/></Button>
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

const SignInWithI18n = withTranslation()(SignIn);
export { SignInWithI18n as SignIn };
