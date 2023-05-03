import { NotificationType } from 'helpers/types';

export interface IProps {
	message: string;
	type: NotificationType;
	callback: () => void;
}
