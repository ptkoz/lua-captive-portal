/**
 * Component description goes here
 */
import * as React from "react";
import { Jumbotron } from "react-bootstrap";

/**
 * Props available on this component
 */
export interface ISuccessProps {

}

/**
 * The component class
 */
export class Success extends React.PureComponent<ISuccessProps, {}> {
	public render(): JSX.Element {
		return (
			<Jumbotron>
				<div className="container">
					<h1>Gratulacje</h1>
					<p className="lead text-justify">Możesz teraz korzystać z internetu.</p>
				</div>
			</Jumbotron>
		);
	}
}