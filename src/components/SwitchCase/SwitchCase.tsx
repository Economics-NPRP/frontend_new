import { Children, PropsWithChildren, ReactNode, isValidElement } from 'react';

export interface SwitchProps extends PropsWithChildren {
	value?: boolean | string | number | null | undefined;
}
export const Switch = ({ value = true, children }: SwitchProps) => {
	let match: ReactNode = null;
	Children.forEach(children, (child) => {
		if (!isValidElement(child)) return;

		const isCase = child.type === Case;
		const isTrueCase = child.type === TrueCase;
		const isFalseCase = child.type === FalseCase;
		const isElse = child.type === Else;

		if (match === null && isCase && child.props.when === value) match = child;
		if (match === null && isTrueCase && value === true) match = child;
		if (match === null && isFalseCase && value === false) match = child;
		if (match === null && isElse) match = child;
	});
	return match;
};

export interface CaseProps extends PropsWithChildren {
	when: boolean | string | number | null | undefined;
}
export const Case = ({ children }: CaseProps) => children;
export const Else = ({ children }: PropsWithChildren) => children;

export const TrueCase = ({ children }: PropsWithChildren) => children;
export const FalseCase = ({ children }: PropsWithChildren) => children;
