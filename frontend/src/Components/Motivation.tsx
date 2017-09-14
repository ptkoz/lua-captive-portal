/**
 * Component description goes here
 */
import * as React from "react";

/**
 * Props available on this component
 */
export interface IMotivationProps {

}

/**
 * The component class
 */
export class Motivation extends React.PureComponent<IMotivationProps, {}> {
	public render(): JSX.Element {
		return (
			<div className="container">
				<h1>Dlaczego token zamiast hasła?</h1>
				<p className="text-justify lead">Przecież kiedyś było hasło. Wisiało sobie na ścianie i każdy mógł je po prostu wpisać. I komu to przeszkadzało? Po co to zmieniałeś?</p>
				<p className="text-justify">Hasło było długie i składało się z bodajże 37 znaków. Musiało być długie, ponieważ się nie zmieniało - więc każdy sąsiad miał mnóstwo czasu, aby próbować je odgadnąć. Powodowało to pewne problemy - większość ludzi za pierwszym razem wpisywała je błędnie, przez co trzeba było zaczynać wszystko od początku. Mało przyjazne interfejsy użytkownika na urządzeniach mobilnych dodatkowo nie poprawiały sytuacji - nie wiedziałeś nawet, gdzie popełniłeś błąd.</p>
				<p className="text-justify">Dla odmiany token ma tylko kilka znaków. Może taki być, ponieważ działa tylko przez parę minut po wygenerowaniu. Dzięki temu zapewnia poziom bezpieczeństwa zbliżony do długiego hasła.</p>
				<p className="text-justify">Dodatkowo token obsługuje się poprzez przyjazny interfejs WWW, więc nawet jeśli przepiszesz go niepoprawnie, będziesz miał szansę zobaczyć gdzie popełniłeś błąd i szybko go poprawić.</p>
				<h2>Dla Ciebie prostsze logowanie...</h2>
				<p className="text-justify">Motywacja to oczywiście nie wszystko. Miałem mnóstwo frajdy budując i oprogramowując cały system. W efekcie ty masz łatwiejszy dostęp do internetu, a ja jestem szczęśliwszy. Win-win. ;-)</p>
			</div>
		);
	}
}