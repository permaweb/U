import React from 'react';

import { ValidationType } from 'arcframework';

import { FormFieldType } from 'helpers/types';

export interface IProps {
	label?: string;
	value: number | string;
	type?: FormFieldType;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	invalid: ValidationType;
	disabled: boolean;
	placeholder?: string;
	endText?: string;
	error?: string | null;
	sm?: boolean;
	testingCtx?: string;
}
