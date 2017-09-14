/**
 * Redux application state
 */
export interface IState {
	token: string;
	isLoading: boolean;
	hasError: boolean;
	errorMessage: string;
}