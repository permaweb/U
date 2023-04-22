import React from 'react';

export interface IProps {
	header: string | null;
	handleClose: () => void;
	children: React.ReactNode;
	noContainer?: boolean;
	zoom?: boolean | undefined;
	useMax?: boolean | undefined;
}
