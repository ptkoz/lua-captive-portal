import * as React from "react";
import { PureTransition } from "./PureTransition";

export interface IPureEntrancePropsOptional {
	/**
	 * Show the component; triggers the enter or exit animation. Defaults
	 * tp false
	 */
	show?: boolean;

	/**
	 * Callback fired before the "entering" classes are applied
	 */
	onEnter?: () => void;

	/**
	 * Callback fired after the "entering" classes are applied
	 */
	onEntering?: () => void;

	/**
	 * Callback fired after the "enter" classes are applied
	 */
	onEntered?: () => void;

	/**
	 * Callback fired before the "exiting" classes are applied
	 */
	onExit?: () => void;

	/**
	 * Callback fired after the "exiting" classes are applied
	 */
	onExiting?: () => void;

	/**
	 * Callback fired after the "exited" classes are applied
	 */
	onExited?: () => void;

	/**
	 * Additional inline styles
	 */
	style?: any;

	/**
	 * Optional timeout for transition events
	 */
	timeout?: number;
}

export interface IPureEntranceProps extends IPureEntrancePropsOptional {
	/**
	 * CSS class or classes applied while the component is entering
	 */
	enteringClassName: string;

	/**
	 * CSS class or classes applied when the component is entered
	 */
	enteredClassName: string;

	/**
	 * CSS class or classes applied while the component is exiting
	 */
	exitingClassName: string;

	/**
	 * CSS class or classes applied when the component is exited
	 */
	exitedClassName: string;
}

enum STATUS { ENTERING, ENTERED, EXITING, EXITED }
interface IPureEntranceState {
	/**
	 * Current transition status
	 */
	status: STATUS;
}

/**
 * Pure CSS3 entrance support with 2 states available (ENTERED, EXITED).
 * Use handlers to control transitions between entrance statuses.
 */
export class PureEntrance extends React.Component<IPureEntranceProps, IPureEntranceState> {
	public static defaultProps: IPureEntrancePropsOptional = {
		show: false,
		timeout: 0,

		onEnter: () => undefined,
		onEntering: () => undefined,
		onEntered: () => undefined,
		onExit: () => undefined,
		onExiting: () => undefined,
		onExited: () => undefined
	};

	/**
	 * The handler to event timeout
	 */
	private eventTimeout: number = null;

	/**
	 * Determine initial state for element
	 */
	public constructor(props: IPureEntranceProps) {
		super(props);

		this.state = {
			status: props.show ? STATUS.ENTERED : STATUS.EXITED
		};
	}

	/**
	 * Perform transition if required.
	 */
	public componentDidUpdate(): void {
		if(this.props.show && this.canEnter()) {
			this.performEnter();
		} else if(!this.props.show && this.canExit()) {
			this.performExit();
		}
	}

	/**
	 * Render the element with appropriate classes
	 */
	public render(): JSX.Element {
		let className;
		switch(this.state.status) {
			case STATUS.ENTERING:
				className = this.props.enteringClassName;
				break;

			case STATUS.ENTERED:
				className = this.props.enteredClassName;
				break;

			case STATUS.EXITING:
				className = this.props.exitingClassName;
				break;

			case STATUS.EXITED:
				className = this.props.exitedClassName;
				break;
		}

		return (
			<PureTransition
				className={className}
				style={this.props.style}
				onTransitionEnd={this.handleTransitionEnd}
			>
				{this.props.children}
			</PureTransition>
		);
	}

	/**
	 * Here we shall cleanup after each transition performed.
	 */
	private handleTransitionEnd = (): void => {
		if(this.eventTimeout) clearTimeout(this.eventTimeout);
		this.eventTimeout = null;

		if(STATUS.ENTERING == this.state.status) {
			let newState: IPureEntranceState = {
				status: STATUS.ENTERED
			};

			this.setState(newState, this.props.onEntered);
		} else if(STATUS.EXITING == this.state.status) {
			let newState: IPureEntranceState = {
				status: STATUS.EXITED
			};

			this.setState(newState, this.props.onExited);
		}
	}

	/**
	 * Basing on current status check if component may
	 * change state to ENTERING.
	 */
	private canEnter(): boolean {
		return STATUS.EXITED == this.state.status || STATUS.EXITING == this.state.status;
	}

	/**
	 * Basing on current status determine if component may
	 * change it's status to EXITING.
	 */
	private canExit(): boolean {
		return STATUS.ENTERED == this.state.status || STATUS.ENTERING == this.state.status;
	}

	private performEnter(): void {
		this.props.onEnter();

		let newState: IPureEntranceState = { status: STATUS.ENTERING };
		if(this.props.timeout) {
			this.eventTimeout = setTimeout(this.handleTransitionEnd, this.props.timeout);
		}
		this.setState(newState, this.props.onEntering);

	}

	private performExit(): void {
		this.props.onExit();

		let newState: IPureEntranceState = { status: STATUS.EXITING };
		if(this.props.timeout) {
			this.eventTimeout = setTimeout(this.handleTransitionEnd, this.props.timeout);
		}
		this.setState(newState, this.props.onExiting);
	}
}