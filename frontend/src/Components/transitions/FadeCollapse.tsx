import * as React from "react";
import { IPureEntrancePropsOptional, PureEntrance } from "./PureEntrance";
import { PureFade } from "./PureFade";
import { PureCollapse } from "./PureCollapse";

interface IFadeCollapseState {
	expanded?: boolean;
	performingExpand?: boolean;
	visible?: boolean;
	performingFadeOut?: boolean;
}

/**
 * Show up effect with both Collapse and Fade native effects used.
 * When entering, container expands first to make some space for
 * incoming content, and then fire fade-in effect.
 *
 * Opposite happens on exit. Content is first removed via Fade-out effect,
 * and then free space is collapsed.
 */
export class FadeCollapse extends React.Component<IPureEntrancePropsOptional, IFadeCollapseState> {
	public static defaultProps = PureEntrance.defaultProps;

	public constructor(props: IPureEntrancePropsOptional) {
		super(props);

		this.state = {
			expanded: props.show,
			performingExpand: false,
			visible: props.show,
			performingFadeOut: false
		};
	}

	/**
	 * If "show" prop change, we shall begin either show-up or
	 * hide animation.
	 */
	public componentWillReceiveProps(props: IPureEntrancePropsOptional): void {
		if(props.show) {
			if(!this.state.expanded) {
				/* start expanding, fade-in will be fired by callback */
				/* if already expanded, nothing changes */
				let newState: IFadeCollapseState = { expanded: true, performingExpand: true };
				this.setState(newState);
			} else if(!this.state.visible && !this.state.performingExpand) {
				/* possibly we may be during fade out animation, need to break it */
				let newState: IFadeCollapseState = { visible: true, performingFadeOut: false };
				this.setState(newState);
			}
		} else {
			if(this.state.visible) {
				/* fade-out, collapse will be fired by callback */
				/* if already fade-out, nothing changes */
				let newState: IFadeCollapseState = { visible: false, performingFadeOut: true };
				this.setState(newState);
			} else if(this.state.expanded && !this.state.performingFadeOut) {
				/* possibly we may be during expand, need to break it */
				let newState: IFadeCollapseState = { expanded: false, performingExpand: false };
				this.setState(newState);
			}
		}
	}

	public render(): JSX.Element {
		return (
			<PureCollapse
				show={this.state.expanded}
				onEntered={this.onCollapseEntered}
				onEnter={this.props.onEnter}
				onEntering={this.props.onEntering}
				onExited={this.props.onExited}
			>
				<PureFade
					show={this.state.visible}
					onExited={this.onFadeExited}
					onEntered={this.props.onEntered}
					onExit={this.props.onExit}
					onExiting={this.props.onExiting}
				>
					{this.props.children}
				</PureFade>
			</PureCollapse>
		);
	}

	/**
	 * Expand animation has finished. Fire up
	 * FadeIn animation to complete show-up process.
	 */
	private onCollapseEntered = (): void => {
		/* must be detached, otherwise does not work properly */
		let newState: IFadeCollapseState = { visible: true, performingExpand: false };
		setTimeout(() => this.setState(newState), 1);
	}

	/**
	 * Fade-out animation has finished. Fire
	 * up collapse animation to complete hide
	 * process.
	 */
	private onFadeExited = (): void => {
		/* must be detached, otherwise does not work properly */
		let newState: IFadeCollapseState = { expanded: false, performingFadeOut: false };
		setTimeout(() => this.setState(newState), 1);
	}
}