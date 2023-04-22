import { ButtonType } from 'helpers/types';

export interface IProps {
	src: string;
	type: ButtonType;
	handlePress: any;
	sm?: boolean;
	warning?: boolean;
	disabled?: boolean;
	info?: string;
	testingCtx?: string;
	dimensions?: {
		wrapper: number;
		icon: number;
	};
	tooltip?: string;
}
