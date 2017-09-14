// tslint:disable:max-classes-per-file
import { IPlainAction, IThunkAction, TypeOnPrototype, IDispatch } from "./Tools/fsa";
import { IState } from "./state";
import { xhr } from "./Tools/xhr";
import { MemoryHistory } from "history";

/**
 * Updates current filtering form state
 */
@TypeOnPrototype("SET_TOKEN")
export class SetToken implements IPlainAction {
	public type: string;
	public payload: string;

	public constructor(token: string) {
		this.payload = token;
	}
}

@TypeOnPrototype("REQUEST_SUBMIT_FORM")
export class RequestSubmitForm implements IPlainAction {
	public type: string;
}

@TypeOnPrototype("RECEIVE_SUBMIT_FORM")
export class ReceiveSubmitForm implements IPlainAction {
	public type: string;
	public payload: Error | string;

	public constructor(response: any) {
		this.payload = response;
	}
}

export class SubmitForm implements IThunkAction {
	public constructor(private history: MemoryHistory) {

	}

	public dispatcher(dispatch: IDispatch, getState: () => IState) {
		dispatch(new RequestSubmitForm());

		dispatch(new ReceiveSubmitForm(
			xhr.postJSON("/cgi-bin/captive.lua/auth/token", { token: getState().token }).then(
				response => {
					this.history.push("/success");
					return response;
				}
			)
		));
	}
}