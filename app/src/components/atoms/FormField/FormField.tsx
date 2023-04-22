import * as S from './styles';
import { IProps } from './types';

export default function FormField(props: IProps) {
	function getValue() {
		if (props.type === 'number') {
			return isNaN(Number(props.value)) ? '' : props.value;
		} else {
			return props.value;
		}
	}

	return (
		<S.Wrapper sm={props.sm}>
			{props.label && <S.Label>{props.label}</S.Label>}
			<S.Input
				type={props.type ? props.type : 'text'}
				value={getValue()}
				onChange={props.onChange}
				disabled={props.disabled}
				invalid={props.invalid.status}
				placeholder={props.placeholder ? props.placeholder : ''}
				sm={props.sm}
				data-testid={props.testingCtx}
			/>
			<S.EndTextContainer disabled={props.disabled} sm={props.sm}>
				{props.endText && <S.EndText sm={props.sm}>{props.endText}</S.EndText>}
			</S.EndTextContainer>
		</S.Wrapper>
	);
}
