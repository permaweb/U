import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	height: 100%;
	width: 100%;
`;

export const ListHeader = styled.div`
	width: 100%;
	background: ${(props) => props.theme.colors.container.primary.background};
	padding: 20px;
	border-top-left-radius: ${STYLING.dimensions.borderRadius};
	border-top-right-radius: ${STYLING.dimensions.borderRadius};
`;

export const Content = styled.div`
	max-width: ${STYLING.cutoffs.max};
	margin: 0 auto;
`;

export const List = styled.ol`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	max-width: ${STYLING.cutoffs.max};
	margin: 0 auto;
	position: relative;
`;

export const Tab = styled.li`
	position: relative;
	display: flex;
	justify-content: center;
	padding: 0 0 15px 0;
`;

export const TabAction = styled.button<{ active: boolean }>`
	position: absolute;
	top: -9.5px;
	padding: 8.15px 25px;
	font-size: ${(props) => props.theme.typography.size.small};
	font-weight: ${(props) => props.theme.typography.weight.medium};

	border-radius: ${STYLING.dimensions.borderRadiusWrapper};

	color: ${(props) => props.theme.colors.font.primary.alt1};
	cursor: pointer;

	&:hover {
		background: ${(props) => props.theme.colors.tabs.hover};
	}

	&:after {
		display: block;
		content: '';
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0);
		bottom: -8.35px;
		background: ${(props) => (props.active ? props.theme.colors.tabs.active : props.theme.colors.transparent)};
		height: 2px;
		width: calc(100% + 10px);
	}
`;

export const View = styled.div`
	height: 100%;
	width: 100%;
	position: relative;
`;
