import * as React from "react";
import { findDOMNode } from "react-dom";
import { PureEntrance, IPureEntrancePropsOptional } from "./PureEntrance";

/**
 * CSS expand / collapse effect based on bootstrap CSS classes
 * and out internal PureEntrance library.
 *
 * @hint Props description available under class definition.
 */
export class PureCollapse extends React.Component<IPureEntrancePropsOptional, {}> {
	public static defaultProps = PureEntrance.defaultProps;

	public render(): JSX.Element {
		return (
			<PureEntrance
				{...this.props}
				enteringClassName="collapsing"
				enteredClassName="collapse in"
				exitingClassName="collapsing"
				exitedClassName="collapse"

				onEnter={this.onEnter}
				onEntering={this.onEntering}
				onEntered={this.onEntered}

				onExit={this.onExit}
				onExiting={this.onExiting}
				onExited={this.onExited}
			/>
		);
	}
	
	private onEnter = (): void  => { this.setHeightCollapsed(); this.props.onEnter(); };
	private onEntering = (): void => { this.setHeightExpanded(); this.props.onEntering(); };
	private onEntered = (): void => { this.removeHeight(); this.props.onEntered(); };
	
	private onExit = (): void => { this.setHeightExpanded(); this.props.onExit(); };
	private onExiting = (): void => { this.setHeightCollapsed(); this.props.onExiting(); };
	private onExited = (): void => { this.removeHeight(); this.props.onExited(); };

	/**
	 * Set target height to which we shall expand. Calculated
	 * automatically.
	 */
	private setHeightExpanded(): void {
		const node: HTMLElement = findDOMNode(this) as HTMLElement;
		node.style.height = node[`scrollHeight`] + "px";
		// force browser to calculate offsetHeight;
		// without this it may not apply height immediately
		((n) => n.offsetHeight)(node);
	}

	/**
	 * Set target height to which we shall collapse. Naturally
	 * it should be 0.
	 */
	private setHeightCollapsed(): void {
		const node: HTMLElement = findDOMNode(this) as HTMLElement;
		node.style.height = "0";
		// force browser to calculate offsetHeight;
		// without this it may not apply height immediately
		((n) => n.offsetHeight)(node);
	}

	/**
	 * Remove overloaded CSS height from DOM element as
	 * it's not needed anymore.
	 * (
	 */
	private removeHeight(): void {
		(findDOMNode(this) as HTMLElement).style.height = null;
	}
}