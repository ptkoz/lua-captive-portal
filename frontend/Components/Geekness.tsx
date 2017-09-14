/**
 * Component description goes here
 */
import * as React from "react";

/**
 * Props available on this component
 */
export interface IGeeknessProps {

}

/**
 * The component class
 */
export class Geekness extends React.PureComponent<IGeeknessProps, {}> {
	public render(): JSX.Element {
		return (
			<div className="container">
				<h1>Dlaczego mi się chciało</h1>
				<p className="text-justify lead">Tyle godzin roboty, zarwane weekendowe noce i to wszystko tylko po, żeby robić dokładnie to samo co robisz w pracy. Przecież to jakaś paranoja, jesteś nienormalny.</p>
				<p className="text-justify">Ciężko to będzie wyjaśnić laikowi, ale budowanie tego projektu nie jest ani trochę zbliżone do tego, czym zajmuję się zawodowo. To dwa różne światy i właśnie dzięki temu mogłem w końcu <strong>ODPOCZĄĆ</strong> od pracy i zająć głowę czymś z zupełnie innym.</p>
				<p className="text-justify">Pisanie oprogramowania dla mikrokontrolera to zabawa w najczystszej postaci. Nie ma systemu operacyjnego, nie ma systemów plików, generalnie nie ma nic - ale jakoś trzeba sobie poradzić. Sam captive portal również specjalnie napisałem w języku Lua, który - w porównaniu do tego, czego używam w pracy - jest po prostu hardcorowo niskopoziomowy.</p>
				<p className="text-justify">Potraktuj więc to proszę jako poszerzanie horyzontów, na którym wszyscy skorzystali.</p>
			</div>
		);
	}
}