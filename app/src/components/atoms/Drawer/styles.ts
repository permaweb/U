import styled from 'styled-components';

import { fadeIn2, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	background: ${(props) => props.theme.colors.accordion.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-bottom-left-radius: ${STYLING.dimensions.borderRadius};
	border-bottom-right-radius: ${STYLING.dimensions.borderRadius};
`;

export const Action = styled.button<{ open: boolean }>`
	height: 42.5px;
	width: 100%;
	border-bottom-left-radius: ${(props) => props.open ? '0' : STYLING.dimensions.borderRadius};
	border-bottom-right-radius: ${(props) => props.open ? '0' : STYLING.dimensions.borderRadius};
	&:hover {
		background: ${(props) => props.theme.colors.accordion.hover};
	}
`;

export const Label = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 2.5px 20px 0 20px;
	span {
		color: ${(props) => props.theme.colors.accordion.color};
	}
	svg {
		width: 15px;
		fill: ${(props) => props.theme.colors.accordion.color};
	}
`;

export const Content = styled.div`
	animation: ${open} ${fadeIn2};
`;