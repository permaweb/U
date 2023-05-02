import React from 'react';

export interface IProps {
	label?: string;
	value: number | string;
	type?: 'number' | 'password';
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	invalid: { status: boolean, message: string | null };
	disabled: boolean;
	placeholder?: string;
	logo?: any;
	error?: string | null;
	sm?: boolean;
	testingCtx?: string;
}
