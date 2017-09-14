import { IState } from "./state";
import * as Actions from "./actions";
import { pipeReducers, Reducer } from "./Tools/fsa";

/**
 * Initial state for this branch.
 */
const initialState: IState = {
	token: "",
	isLoading: false,
	hasError: false,
	errorMessage: null
};

export const reducer = pipeReducers([
	new Reducer(
		Actions.SetToken,

		(state: IState, action: Actions.SetToken): IState => {
			/* build new state */
			return {
				...state,
				token: action.payload,
				hasError: false
			};
		}
	),

	new Reducer(
		Actions.RequestSubmitForm,

		(state: IState): IState => {
			return { ...state, isLoading: true, hasError: false };
		}
	),

	new Reducer(
		Actions.ReceiveSubmitForm,

		// onSuccess
		(): IState => {
			return initialState;
		},

		// onFailure
		(state: IState, action: Actions.ReceiveSubmitForm): IState => {
			if(action.payload instanceof Error) {
				return { ...state, isLoading: false, hasError: true, errorMessage: "Wystąpił niespodziewany błąd - spróbuj ponownie później." };
			} else {
				return { ...state, isLoading: false, hasError: true, errorMessage: action.payload };
			}
		}
	)
], initialState);