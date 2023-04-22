import React from 'react';

import { Button } from 'components/atoms/Button';
import { CONFIRMATION_BLOCK_HEIGHT } from 'helpers/config';
import { language } from 'helpers/language';
import { convertCamelCase, formatAddress } from 'helpers/utils';

import * as S from './styles';
import { IProps } from './types';

export default function OrderNotification(props: IProps) {
	const [stateObj, setStateObj] = React.useState<{
		notificationHeader: string;
		status: {
			value: string;
			style: string;
		};
		fee: string;
		windowMessage: string | null;
		footerMessage: string | null;
		action: {
			label: string;
			fn: any;
			disabled: boolean;
		};
	} | null>(null);

	React.useEffect(() => {
		if (props.order) {
			const status = `${convertCamelCase(props.order.orderLine.status.type)} (${
				props.order.orderLine.status.startHeight
			} / ${CONFIRMATION_BLOCK_HEIGHT})`;
			const fee = `${props.order.orderLine.fee} ${language.arTokens}`;

			switch (props.order.orderLine.status.type) {
				case 'pending':
					setStateObj({
						notificationHeader: language.awaitingConfirmation,
						status: {
							value: status,
							style: 'p-neutral',
						},
						fee: fee,
						windowMessage: language.pendingWindow,
						footerMessage: null,
						action: {
							label: language.completeOrder,
							fn: () => console.log('Complete Order'),
							disabled: true,
						},
					});
				case 'confirmed':
					setStateObj({
						notificationHeader: language.orderConfirmed,
						status: {
							value: status,
							style: 'p-positive',
						},
						fee: `${props.order.orderLine.fee} ${language.arTokens}`,
						windowMessage: language.confirmationWindow,
						footerMessage: null,
						action: {
							label: language.completeOrder,
							fn: () => console.log('Complete Order'),
							disabled: false,
						},
					});
				case 'outbid':
					setStateObj({
						notificationHeader: language.orderOutbid,
						status: {
							value: status,
							style: 'p-neutral',
						},
						fee: fee,
						windowMessage: null,
						footerMessage: language.orderOutbidMessage,
						action: {
							label: language.startOver,
							fn: () => console.log('Start Over'),
							disabled: false,
						},
					});
				case 'expired':
					setStateObj({
						notificationHeader: language.orderExpired,
						status: {
							value: language.expired,
							style: 'p-negative',
						},
						fee: fee,
						windowMessage: null,
						footerMessage: language.orderExpiredMessage,
						action: {
							label: language.startOver,
							fn: () => console.log('Start Over'),
							disabled: false,
						},
					});
				case 'complete':
					setStateObj({
						notificationHeader: language.orderComplete,
						status: {
							value: language.complete,
							style: 'p-positive',
						},
						fee: fee,
						windowMessage: null,
						footerMessage: language.checkViewblock('#'), // TODO: Link
						action: {
							label: language.startOver,
							fn: () => console.log('Start Over'),
							disabled: false,
						},
					});
			}
		}
	}, [props.order]);

	return props.order && stateObj ? (
		<S.Wrapper className={'wrapper'}>
			<S.Notification>
				<p>{stateObj ? stateObj.notificationHeader : `-`}</p>
			</S.Notification>
			<S.Content>
				<S.HeaderWrapper>
					<p>{language.notificationHeader(convertCamelCase(props.orderType))}</p>
				</S.HeaderWrapper>
				<S.DetailWrapper>
					<S.DetailHeaderWrapper>
						{Object.keys(props.order.orderLine).map((value: string, index: number) => {
							return (
								<S.ContentLine key={index}>
									<p>{convertCamelCase(value)}</p>
								</S.ContentLine>
							);
						})}
					</S.DetailHeaderWrapper>
					<S.DetailBodyWrapper>
						<S.DetailLine>
							<p>{formatAddress(props.order.orderLine.owner, false)}</p>
						</S.DetailLine>
						<S.DetailLine>
							<p className={'p-positive'}>{`+${props.order.orderLine.mint} ${language.pcTokens}`}</p>
						</S.DetailLine>
						<S.DetailLine>
							<p className={stateObj.status.style}>{stateObj.status.value}</p>
						</S.DetailLine>
						<S.DetailLine>
							<p>{stateObj.fee}</p>
						</S.DetailLine>
					</S.DetailBodyWrapper>
				</S.DetailWrapper>
				{stateObj.windowMessage && (
					<S.WindowWrapper>
						<p>{stateObj.windowMessage}</p>
						<p>{`${CONFIRMATION_BLOCK_HEIGHT - props.order.orderLine.status.startHeight} ${language.blocks}`}</p>
					</S.WindowWrapper>
				)}
			</S.Content>
			{stateObj.footerMessage && (
				<S.FooterMessage>
					<p>{stateObj.footerMessage}</p>
				</S.FooterMessage>
			)}
			<Button
				type={'alt2'}
				label={stateObj.action.label}
				handlePress={() => stateObj.action.fn()}
				height={52.5}
				fullWidth
				disabled={stateObj.action.disabled}
			/>
		</S.Wrapper>
	) : null;
}
