/**
 * Component description goes here
 */
import * as React from "react";
import { Motivation } from "./Motivation";
import { Geekness } from "./Geekness";
import { SignIn } from "./SignIn";
import { Error404 } from "./Error404";
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
				<Route path="/404" component={Error404}/>
			</div>
		);
	}
}