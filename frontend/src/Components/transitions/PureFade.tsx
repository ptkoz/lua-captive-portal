import * as React from "react";
import { PureEntrance, IPureEntrancePropsOptional } from "./PureEntrance";

/**
 * CSS fade in / out effect based on bootstrap CSS classes
 * and out internal PureEntrance library.
 */
export const PureFade = (props: IPureEntrancePropsOptional & React.Component["props"]): JSX.Element => (
	<PureEntrance
		{...props}
		enteringClassName="fade in"
		enteredClassName="fade in"
		exitingClassName="fade"
		exitedClassName="fade"
	/>
);
