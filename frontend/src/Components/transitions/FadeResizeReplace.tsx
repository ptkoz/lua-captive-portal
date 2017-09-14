/**
 * Component with single children that makes animation
 * when the element inside is replaced. Current element
 * fades out, then box is re-sized up to new element size,
 * and finally new element comes in.
 *
 * @Warning: only one children of this component is allowed at time.
 */
import * as React from "react";
import { findDOMNode } from "react-dom";
import { PureFade } from "./PureFade";
import { PureTransition } from "./PureTransition";

/**
 * Interface for component state
 */
interface IFadeReplaceState {
	/**
	 * Currently displayed element
	 */
	current?: React.ReactElement<any>;

	/**
	 * Variable controlling fadeIn / fadeOut
	 * effect of PureFade.
	 */
	visible?: boolean;

	/**
	 * Element to display once current elements is removed.
	 */
	next?: React.ReactElement<any>;

	/**
	 * Class name for the re-size transition element
	 */
	resizeTransitionClassName?: string;
}

/**
 * Predefined constant values
 */
const CLASSNAME_RESIZING = "collapsing";
const CLASSNAME_READY = "collapse in";

/**
 * The component
 */
export class FadeResizeReplace extends React.PureComponent<{}, IFadeReplaceState> {
	public constructor(props) {
		super(props);

		this.state = {
			current: React.Children.only(props.children),
			visible: true,
			next: null,
			resizeTransitionClassName: CLASSNAME_READY
		};
	}

	/**
	 * Check the only children key and compare it with one stored
	 * in state. If keys are different, it's time to replace current
	 * element.
	 */
	public componentWillReceiveProps(props): void {
		const child = React.Children.only(props.children);
		if(child.key != this.state.current.key) {
			// Set next element and start hiding current.
			const wasAlreadyFadedOut = !this.state.visible && !this.state.next;
			this.setState({ next: child, visible: false }, () => {
				/* manually trigger if exiting element was already faded out */
				if(wasAlreadyFadedOut) this.onCurrentExited();
			});
		} else {
			// If there was next element already set, reset it back
			// to null and make current visible again.
			// This may happen when element gets replaced, but then
			// original element comes back before fadeOut is completed.
			this.setState({ current: child, next: null, visible: true });
		}
	}

	/**
	 * Render PureTransition for adjustable-height div and
	 * PureFade for it's content.
	 */
	public render(): JSX.Element {
		return (
			<PureTransition
				onTransitionEnd={this.onBoxAdjusted}
				className={this.state.resizeTransitionClassName}
				onScroll={this.preventScroll}
			>
				<PureFade
					show={this.state.visible}
					onExited={this.onCurrentExited}
				>
					{this.state.current}
				</PureFade>
			</PureTransition>
		);
	}

	/**
	 * Current element faded out, we may now resize the box
	 * and show the new element.
	 */
	private onCurrentExited = (): void => {
		// save current height, as element content is about to be replaced
		const node: HTMLElement = findDOMNode(this) as HTMLElement;
		node.style.height = node.firstChild[`scrollHeight`] + "px";

		// force browser to calculate offsetHeight;
		// without this it may not apply height immediately
		((n) => n.offsetHeight)(node);

		// Replace the element content, but don't show it yet. First we
		// need to resize the box.
		const newState: IFadeReplaceState = { next: null, current: this.state.next, visible: false, resizeTransitionClassName: CLASSNAME_RESIZING };
		this.setState(newState, () => {
			// Now new element is rendered, we may resize the box if necessary.
			// This will trigger resize animation. Once it is completed,
			// onBoxAdjusted callback will be fired.
			const previousHeight = node.style.height;
			node.style.height = node.firstChild[`scrollHeight`] + "px";

			// force browser to calculate offsetHeight;
			// without this it may not apply height immediately
			((n) => n.offsetHeight)(node);

			// height are the same, so event there is no transition event
			if(node.style.height === previousHeight) {
				this.onBoxAdjusted();
			}
		});
	}

	/**
	 * Box has been re-sized, fade in the content.
	 */
	private onBoxAdjusted = (): void => {
		(findDOMNode(this) as HTMLElement).style.height = null;
		if(!this.state.next) this.setState({ visible: true, resizeTransitionClassName: CLASSNAME_READY });
	}

	/**
	 * This is required to allow 1password (and possibly other password
	 * managers to fill the form correctly.
	 *
	 * Due to browsers native password saving feature, all form inputs
	 * have to be accessible on the same time. The can not have
	 * display: none (password would not save in safari) or visibility: hidden.
	 *
	 * All form inputs are displayed at the same time, but some of them may be
	 * moved outside of appNode viewport. 1 password will set scrollLeft
	 * on this layer to show input which was filled up.
	 *
	 * We need to reset this setting back to normal state.
	 */
	private preventScroll = (event): void => {
		const scrollingNode = findDOMNode(this);
		if(scrollingNode.scrollLeft != 0) {
			scrollingNode.scrollLeft = 0;
		}
		if(scrollingNode.scrollTop != 0) {
			scrollingNode.scrollTop = 0;
		}
	}
}