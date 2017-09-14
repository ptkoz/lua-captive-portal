import * as React from "react";
import EventHandler = React.EventHandler;

export interface IPureTransitionProps extends React.HTMLProps<HTMLDivElement> {
	/**
	 * Callback fired when transition is completed
	 */
	onTransitionEnd?: (e?: any) => void;
}

/**
 * Pure CSS3 transition support, without ugly hacks, without support
 * for obsolete browsers, pure all-new transitions.
 *
 * Transition may be triggered by changing the class name, modifying
 * DOM node by some other trigger. As long as transitionEndEvent is
 * caught, the onTransitionEnd callback will work.
 */
export class PureTransition extends React.PureComponent<IPureTransitionProps, {}> {
	public static defaultProps: IPureTransitionProps = {
		onTransitionEnd: () => undefined
	};

	/**
	 * div's DOM node.
	 */
	private refNode: HTMLElement;

	/**
	 * If event comes from our DOM node, trigger
	 * callback.
	 */
	public handleTransitionEnd(e: Event): void {
		// ignore events bubbled from children
		if(e.target === this.refNode) {
			this.props.onTransitionEnd(e);
		}
	}

	/**
	 * Bind transition end event to our handleTransitionEnd
	 * method.
	 */
	public componentDidMount(): void {
		this.refNode.addEventListener("transitionend", e => this.handleTransitionEnd(e));
	}

	/**
	 * Render div element
	 */
	public render(): JSX.Element {
		let { onTransitionEnd, ...props } = this.props;
		return <div ref={this.onDivMounted} {...props}>{this.props.children}</div>;
	}

	/**
	 * Save div's DOM node once available
	 */
	private onDivMounted = (node) => {
		this.refNode = node;
	}
}