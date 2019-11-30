/**
 * Component description goes here
 */
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * Props available on this component
 */
export interface IMotivationProps extends WithTranslation {

}

/**
 * The component class
 */
class Motivation extends React.PureComponent<IMotivationProps, {}> {
	public render(): JSX.Element {
		return (
			<div className="container">
				<h1>{this.props.t("Why token instead of password?")}</h1>
				<p className="text-justify lead">{this.props.t("There used to be a password. It hung on the wall and anyone could just enter it. And who bothered it? Why did you change it?")}</p>
				<p className="text-justify">{this.props.t("The password was long and consisted of probably 37 characters. It had to be long because it didn't change - so each neighbor had plenty of time to try to guess it. This caused some problems - most people typed them incorrectly the first time, so you had to start everything from the beginning. Unfriendly user interfaces on mobile devices did not improve the situation - you did not even know where you made the mistake.")}</p>
				<p className="text-justify">{this.props.t("For a change, the token has only a few characters. This can be because it only works for a few minutes after being generated. Thanks to this, it ensures a level of security similar to that of a long password.")}</p>
				<p className="text-justify">{this.props.t("In addition, the token is handled via a friendly web interface, so even if you rewrite it incorrectly, you'll have the chance to see where you made the mistake and quickly correct it.")}</p>
				<h2>{this.props.t("Easier login for you ...")}</h2>
				<p className="text-justify">{this.props.t("Of course, motivation is not everything. I had a lot of fun building and programming the entire system. As a result, you have easier access to the internet and I am happier. Win-win. ;-)")}</p>
			</div>
		);
	}
}

const MotivationWithI18n = withTranslation()(Motivation);
export { MotivationWithI18n as Motivation };
