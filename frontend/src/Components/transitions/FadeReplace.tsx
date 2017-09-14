/**
 * Component with single children that makes animation
 * when the element inside is replaced. Current element
 * fades out, then new element comes in.
 *
 * @Warning: only one children of this component is allowed at time.
 */
import * as React from "react";
import { PureFade } from "./PureFade";

/**
 * Interface for component state
 */
interface IFadeReplaceState {
	/**
	 * Currently displayed element.
	 */
	current?: React.ReactElement<any>;

	/**
	 * Element to display once current elements faded out.
	 */
	next?: React.ReactElement<any>;
}

/**
 * The component
 */
export class FadeReplace extends React.PureComponent<{}, IFadeReplaceState> {
	public constructor(props) {
		super(props);

		this.state = {
			current: React.Children.only(props.children),
			next: null
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
			// Set next element.
			this.setState({ next: child });
		} else {
			// If there was next element already set, reset it back
			// to null and make current visible again.
			// This may happen when element gets replaced, but then
			// original element comes back before fadeOut is completed.
			this.setState({ current: child, next: null });
		}
	}

	/**
	 * Render PureTransition for adjustable-height div and
	 * PureFade for it's content.
	 */
	public render(): JSX.Element {
		return (
			<PureFade
				show={null === this.state.next}
				onExited={this.onCurrentExited}
			>
				{this.state.current}
			</PureFade>
		);
	}

	/**
	 * Current element faded out, we may now display new element.
	 */
	private onCurrentExited = (): void => {
		this.setState({ next: null, current: this.state.next });
	}
}