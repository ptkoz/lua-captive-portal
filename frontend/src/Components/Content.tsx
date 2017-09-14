/**
 * Component description goes here
 */
import * as React from "react";
import { Motivation } from "./Motivation";
import { Geekness } from "./Geekness";
import { SignIn } from "./SignIn";
import { Route } from "react-router";

/**
 * Props available on this component
 */
export interface IContentProps {

}

/**
 * The component class
 */
export class Content extends React.PureComponent<IContentProps, {}> {
	public render(): JSX.Element {
		return (
			<div>
				<Route path="/" exact component={SignIn}/>
				<Route path="/geekness" component={Geekness}/>
				<Route path="/motivation" component={Motivation}/>
			</div>
		);
	}
}