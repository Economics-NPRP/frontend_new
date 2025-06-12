'use client';

import { Children, PropsWithChildren, ReactNode, isValidElement, useEffect, useState } from 'react';

export interface SwitchProps extends PropsWithChildren {
	value?: boolean | string | number | null | undefined;
	debug?: boolean;
}
export interface CaseProps extends PropsWithChildren {
	when: boolean | string | number | null | undefined;
}

const evaluateMatch = ({ value, children }: SwitchProps): ReactNode => {
	let foundMatch: ReactNode = false;
	Children.forEach(children, (child) => {
		if (!isValidElement(child)) return;

		const isCase = child.type === Switch.Case;
		const isTrueCase = child.type === Switch.True;
		const isFalseCase = child.type === Switch.False;
		const isElse = child.type === Switch.Else;

		if (!foundMatch && isCase && child.props.when === value) foundMatch = child;
		if (!foundMatch && isTrueCase && value === true) foundMatch = child;
		if (!foundMatch && isFalseCase && !value) foundMatch = child;
		if (!foundMatch && isElse) foundMatch = child;
	});
	return foundMatch;
};

const Switch = ({ value = true, children }: SwitchProps) => {
	const [match, setMatch] = useState<ReactNode>(() => evaluateMatch({ value, children }));

	useEffect(() => setMatch(evaluateMatch({ value, children })), [value]);

	return match;
};

Switch.Case = ({ children }: CaseProps) => children;
Switch.Else = ({ children }: PropsWithChildren) => children;

Switch.True = ({ children }: PropsWithChildren) => children;
Switch.False = ({ children }: PropsWithChildren) => children;

export { Switch };
