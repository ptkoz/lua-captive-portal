import * as React from "react";
import { render } from "react-dom";

import { createStore, applyMiddleware, compose, Store, GenericStoreEnhancer } from "redux";
import { Provider as ReduxProvider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";
import { Root } from "./Components/Root";

let middleware = applyMiddleware();

/**
 * Now we can create our redux store
 */
// noinspection TypeScriptUnresolvedVariable
if("production" !== process.env.NODE_ENV) {
	if(window["devToolsExtension"]) {
		middleware = compose(middleware, window["devToolsExtension"]()) as GenericStoreEnhancer;
	}
}

// Create redux store
let store: Store<{}> = createStore((x) => x, middleware);
// define app HTML node
let appNode = document.getElementById("main");

/**
 * OK, let's render the application.
 */
render((
	<Router>
		<ReduxProvider store={store}>
			<Root />
		</ReduxProvider>
	</Router>
), appNode);
