/**
 * Common definitions for TypeScript to deal with Flux Standard Actions
 * represented as objects implementing IAction interface.
 */

/**
 * Flux standard action instance, may be represented as class and
 * will be converted to plain object by the middleware.
 */
import { Store as ReduxStore } from "redux";

/**
 * Common root class for TS-FSA actions.
 */
export interface IAction {

}

/**
 * Dispatcher for our middleware function
 */
export type IDispatch = <T extends IAction>(action: T) => T;

export interface IPlainAction extends IAction {
	type: string;
	payload?: any;
	error?: boolean;
	meta?: any;
}

/**
 * Decorator for action class to set Type property on
 * class prototype.
 */
interface IActionClass<T extends IPlainAction> {
	prototype?: T;
	new(...args: any[]): T;
}

/**
 * Decorator that sets the type property on prototype, instead
 * of default TypeScript constructor initialization.
 *
 * This may be removed once TypeScript gets support
 * for defining properties in prototype (or static
 * properties on interface)
 *
 * @param type unique action type value
 */
export function TypeOnPrototype<T extends IPlainAction>(type: string) {
	return (ActionClass: IActionClass<T>) => {
		ActionClass.prototype.type = type;
	};
}

/**
 * Type guard for IPlainAction interface
 */
function isPlainAction(a: any): a is IPlainAction {
	return ("object" === typeof a) && ("string" === typeof Object.getPrototypeOf(a).type);
}

/**
 * Interface for actions interpreted by the redux-thunk middleware.
 * Dispatcher method will be the one passed to thunk middleware by
 * our middleware.
 */
export interface IThunkAction extends IAction {
	dispatcher(dispatch: (action: any) => any, getState: () => any);
}

/**
 * Type guard for IThunkAction interface
 */
function isThunkAction(a: any): a is IThunkAction {
	return typeof a.dispatcher === "function";
}

/**
 * Type guard for Promises}
 */
function isPromise(a: any): a is Promise<any> {
	return a && typeof a.then === "function";
}

function convertPlainAction(action: IPlainAction) {
	return {
		type: action.type,
		payload: action.payload,
		error: action.error,
		meta: action.meta
	};
}

/**
 * Middleware for TypeScript FSA classes.
 */
export const tsFsaMiddleWare = (store: ReduxStore<any>) => next => action => {
	if(isPlainAction(action)) {
		if(isPromise(action.payload)) {
			return action.payload.then(
				result => store.dispatch({ ...convertPlainAction(action), payload: result }),
				error => store.dispatch({ ...convertPlainAction(action), payload: error, error: true })
			);
		} else {
			return next(convertPlainAction(action));
		}
	} else if(isThunkAction(action)) {
		return action.dispatcher(store.dispatch, store.getState);
	} else {
		return next(action);
	}
};

/**
 * Type definition for action reducers.
 */
type IActionReducer<S, T extends IPlainAction> = (state: S, action?: T) => S;

/**
 * Create handlers only for specified exact action class.
 */
export class Reducer<S, A extends IPlainAction>  {
	private handledActionType: string;

	/**
	 * @param actionClass Specific action class to handle
	 *
	 * @param onSuccess Optional handler called for every T action without error.
	 * 					If no success handler is specified, actions without an error
	 * 					are silently ignored by this reducer.
	 *
	 * @param onFailure Optional handler called for every T action with error.
	 * 					If no failure handler is specified, actions containing and error
	 * 					are silently ignored by this reducer.
	 */
	public constructor(actionClass: IActionClass<A>, private onSuccess?: IActionReducer<S, A>, private onFailure?: IActionReducer<S, A>) {
		this.handledActionType = actionClass.prototype.type;
		if(!this.handledActionType) {
			let name: string = typeof actionClass;
			if(actionClass.constructor && actionClass.constructor["name"]) name = actionClass.constructor["name"];
			throw new Error("Provided action class of " + name + " has empty type property");
		}
	}

	/**
	 * Run the appropriate handler by the action.error
	 * value.
	 *
	 * @param state
	 * @param action
	 */
	public reduce(state: S, action: A): S {
		if(action.type !== this.handledActionType)
			return state;
		
		if(action.error) {
			return this.onFailure ? this.onFailure(state, action) : state;
		} else {
			return this.onSuccess ? this.onSuccess(state, action) : state;
		}
	}
}

/**
 * Chain provided reducers from left to right to create one common
 * reducer.
 *
 * @param reducers Array of reducers
 * @param initialState State to init store with
 */
export function pipeReducers<T>(reducers: Array<Reducer<T, IPlainAction>>, initialState?: T): (state: T, action: IPlainAction) => T {
	return reducers.reduce(
		(previous: IActionReducer<T, IPlainAction>, current: Reducer<T, IPlainAction>): IActionReducer<T, IPlainAction> => {
			return (state: T, action: IPlainAction): T => {
				return current.reduce(previous(state, action), action);
			};
		},
		(state: T = initialState, action: IPlainAction) => state
	);
}