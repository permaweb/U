import { language } from 'helpers/language';

import * as S from './styles';

export default function NotFound() {
	return (
		<S.Wrapper>
			<S.Content>
				<S.Header>404</S.Header>
				<S.Divider />
				<S.Message>{language.pageNotFound}</S.Message>
			</S.Content>
		</S.Wrapper>
	);
}
