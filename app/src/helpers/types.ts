export type URLViewType = {
	label: string;
	disabled: boolean;
	url: any;
	view: React.ComponentType;
};

export interface IURLView {
	exchange: URLViewType[];
}

export type ButtonType = 'primary' | 'alt1' | 'alt2' | 'alt3' | 'success' | 'warning';
export type NotificationType = 'success' | 'warning' | 'neutral';
export type ResponseType = { status: boolean, message: string | null};
