/**
 * Component description goes here
 */
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * Props available on this component
 */
export interface IGeeknessProps {

}

/**
 * The component class
 */
class Geekness extends React.PureComponent<IGeeknessProps & WithTranslation, {}> {
	public render(): JSX.Element {
		return (
			<div className="container">
				<h1>{this.props.t("Why did I want to")}</h1>
				<p className="text-justify lead">{this.props.t("So many hours of work, late weekend nights and all just to do exactly what you do at work. It's some kind of paranoia, you're insane.")}</p>
				<p className="text-justify">{this.props.t("It will be difficult to explain to a layman, but building this project is not at all similar to what I do professionally. They are two different worlds and that's why I could finally ")}<strong>{this.props.t("REST")}</strong>{this.props.t(" from work and take care of something completely different.")}</p>
				<p className="text-justify">{this.props.t("Writing software for a microcontroller is fun in its purest form. There is no operating system, no file systems, generally nothing - but somehow you have to deal with it. The captive portal itself was also specially written in Lua, which - compared to what I use at work - is simply hardcore low-level.")}</p>
				<p className="text-justify">{this.props.t("So please treat it as broadening the horizons that everyone has benefited from.")}</p>
			</div>
		);
	}
}

const GeeknessWithI18n = withTranslation()(Geekness);
export { GeeknessWithI18n as Geekness };
