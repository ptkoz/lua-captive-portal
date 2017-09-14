/**
 * Component description goes here
 */
import * as React from "react";
import { Button, FormControl as BsFormControl, FormGroup, InputGroup } from "react-bootstrap";

/**
 * Props available on this component
 */
export interface IFormControlProps {

}

/**
 * The component class
 */
export class FormControl extends React.PureComponent<IFormControlProps, {}> {
	public render(): JSX.Element {
		return (
			<FormGroup>
				<InputGroup bsSize="lg">
					<BsFormControl placeholder="Wpisz swój token"/>
					<InputGroup.Button>
						<Button type="submit" bsStyle="primary" style={{width: "15rem"}}>Dalej</Button>
					</InputGroup.Button>
				</InputGroup>
			</FormGroup>
		);
	}
}