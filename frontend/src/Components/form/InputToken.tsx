/**
 * Component description goes here
 */
import * as React from "react";
import { FormControl, FormControlProps } from "react-bootstrap";
import { connect } from "react-redux";
import { IState } from "../../state";
import { SetToken } from "../../actions";

interface IInputTokenStateProps {
	disabled: boolean;
	value: string;
	placeholder: string;
}

interface IInputTokenDispatchProps {
	onChange(event: any): void;
}

const mapStateToProps = (state: IState): IInputTokenStateProps => ({
	disabled: state.isLoading,
	value: state.token,
	placeholder: "Wpisz swój token"
});

const mapDispatchToProps = (dispatch): IInputTokenDispatchProps => ({
	onChange: (event): void => {
		dispatch(new SetToken(event.target.value));
	}
});

export const InputToken = connect<IInputTokenStateProps, IInputTokenDispatchProps, FormControlProps>(mapStateToProps, mapDispatchToProps)(FormControl as any);