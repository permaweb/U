import styled from 'styled-components';

import { loaderKeyFrame, loadingSlide, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
	height: 100%;
	width: 100%;
	position: absolute;
	z-index: 11;
	top: 0;
	left: 0;
	background: ${(props) => props.theme.colors.view.background};
	animation: ${open};
`;

export const Container = styled.div`
	height: 50px;
	width: 50px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 3;
`;

export const Blade = styled.div`
	background-color: ${(props) => props.theme.colors.loader.primary};
	position: absolute;
	left: 0.4629em;
	bottom: 0;
	border-radius: 12px;
	transform-origin: center -0.2222em;
	-webkit-animation: ${loaderKeyFrame} 0.75s linear infinite;
	animation: ${loaderKeyFrame} 0.75s linear infinite;
`;

export const Spinner = styled.div<{
	size: number;
	height: number;
	width: number;
}>`
	font-size: ${(props) => `${props.size.toString()}px`};
	position: relative;
	display: inline-block;
	width: 1em;
	height: 1em;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	margin: auto;
	& ${Blade}:nth-child(1) {
		transform: rotate(0deg);
		animation-delay: -0.6875s;
		height: ${(props) => `${props.height.toString()}px`};
		width: ${(props) => `${props.width.toString()}px`};
	}
	& ${Blade}:nth-child(2) {
		transform: rotate(30deg);
		animation-delay: -0.625s;
		height: ${(props) => `${props.height.toString()}px`};
		width: ${(props) => `${props.width.toString()}px`};
	}
	& ${Blade}:nth-child(3) {
		transform: rotate(60deg);
		animation-delay: -0.5625s;
		height: ${(props) => `${props.height.toString()}px`};
		width: ${(props) => `${props.width.toString()}px`};
	}
	& ${Blade}:nth-child(4) {
		transform: rotate(90deg);
		animation-delay: -0.5s;
		height: ${(props) => `${props.height.toString()}px`};
		width: ${(props) => `${props.width.toString()}px`};
	}
	& ${Blade}:nth-child(5) {
		transform: rotate(120deg);
		animation-delay: -0.4375s;
		height: ${(props) => `${props.height.toString()}px`};
		width: ${(props) => `${props.width.toString()}px`};
	}
	& ${Blade}:nth-child(6) {
		transform: rotate(150deg);
		animation-delay: -0.375s;
		height: ${(props) => `${props.height.toString()}px`};
		width: ${(props) => `${props.width.toString()}px`};
	}
	& ${Blade}:nth-child(7) {
		transform: rotate(180deg);
		animation-delay: -0.3125s;
		height: ${(props) => `${props.height.toString()}px`};
		width: ${(props) => `${props.width.toString()}px`};
	}
	& ${Blade}:nth-child(8) {
		transform: rotate(210deg);
		animation-delay: -0.25s;
		height: ${(props) => `${props.height.toString()}px`};
		width: ${(props) => `${props.width.toString()}px`};
	}
	& ${Blade}:nth-child(9) {
		transform: rotate(240deg);
		animation-delay: -0.1875s;
		height: ${(props) => `${props.height.toString()}px`};
		width: ${(props) => `${props.width.toString()}px`};
	}
	& ${Blade}:nth-child(10) {
		transform: rotate(270deg);
		animation-delay: -0.125s;
		height: ${(props) => `${props.height.toString()}px`};
		width: ${(props) => `${props.width.toString()}px`};
	}
	& ${Blade}:nth-child(11) {
		transform: rotate(300deg);
		animation-delay: -0.0625s;
		height: ${(props) => `${props.height.toString()}px`};
		width: ${(props) => `${props.width.toString()}px`};
	}
	& ${Blade}:nth-child(12) {
		transform: rotate(330deg);
		animation-delay: 0s;
		height: ${(props) => `${props.height.toString()}px`};
		width: ${(props) => `${props.width.toString()}px`};
	}
`;

export const Placeholder = styled.div`
	height: 100%;
	width: 100%;
	position: relative;
	background: linear-gradient(
			to right,
			${(props) => props.theme.colors.table.placeholder.backgroundStart},
			${(props) => props.theme.colors.table.placeholder.backgroundSlide} 50%,
			${(props) => props.theme.colors.table.placeholder.backgroundEnd} 80%
		),
		${(props) => props.theme.colors.table.placeholder.background};
	background-repeat: repeat-y;
	background-size: 50px 500px;
	background-position: 0 0;
	animation: ${loadingSlide} 1.25s infinite;
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadiusWrapper};
`;
