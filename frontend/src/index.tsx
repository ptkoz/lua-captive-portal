import * as React from "react";
import { render } from "react-dom";

import { createStore, applyMiddleware, compose, Store } from "redux";
import { Provider as ReduxProvider } from "react-redux";
import { MemoryRouter } from "react-router";

import "./i18n";
import { Root } from "./Components/Root";
import { IState } from "./state";
import { reducer } from "./reducer";
import { tsFsaMiddleWare } from "./Tools/fsa";

let middleware = applyMiddleware(tsFsaMiddleWare);

/**
 * Now we can create our redux store
 */
// noinspection TypeScriptUnresolvedVariable
if("production" !== process.env.NODE_ENV) {
	if(window["devToolsExtension"]) {
		middleware = compose(middleware, window["devToolsExtension"]());
	}
}

// Create redux store
const store: Store<IState> = createStore(reducer, middleware);
// define app HTML node
const appNode = document.getElementById("main");

/**
 * OK, let's render the application.
 */
render((
	<MemoryRouter initialEntries={appNode.dataset.href ? [appNode.dataset.href] : ["/"]}>
		<ReduxProvider store={store}>
			<React.Suspense fallback="Loading..."><Root /></React.Suspense>
		</ReduxProvider>
	</MemoryRouter>
), appNode);
