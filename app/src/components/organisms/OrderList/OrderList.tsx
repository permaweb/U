import React from 'react';

import { Drawer } from 'components/atoms/Drawer';
import { language } from 'helpers/language';
import { MintOrderLineType } from 'helpers/types';
import { convertCamelCase, formatAddress } from 'helpers/utils';

import * as S from './styles';
import { IProps } from './types';

export default function OrderList(props: IProps) {
	function getHeader() {
		if (props.orderLines && props.orderLines.length) {
			return (
				<S.Header>
					{Object.keys(props.orderLines[0]).map((value: string, index: number) => {
						return (
							<S.HeaderValue key={index} widthPercentage={100 / Object.keys(props.orderLines![0]).length}>
								<p>{convertCamelCase(value)}</p>
							</S.HeaderValue>
						);
					})}
				</S.Header>
			);
		} else {
			return null;
		}
	}

	function getDetail() {
		if (props.orderLines && props.orderLines.length) {
			const groupedOrderLines = groupByStatusType(props.orderLines);
			const widthPercentage = 100 / Object.keys(props.orderLines![0]).length;

			return (
				<S.DetailWrapper>
					{Object.keys(groupedOrderLines).map((key: any) => {
						return (
							<React.Fragment key={key}>
								<S.DetailSubheader key={key}>
									<p>{convertCamelCase(key)}</p>
								</S.DetailSubheader>
								{groupedOrderLines[key].map((mintOrderLine: MintOrderLineType, index: number) => {
									return (
										<S.DetailLine
											key={index}
											type={mintOrderLine.status.type}
											ownerLine={props.owner ? props.owner === mintOrderLine.owner : false}
										>
											<S.DetailValue widthPercentage={widthPercentage}>
												<p>{formatAddress(mintOrderLine.owner, false)}</p>
											</S.DetailValue>
											<S.DetailValue widthPercentage={widthPercentage}>
												<S.MintValue>{`${mintOrderLine.mint} ${language.pcTokens}`}</S.MintValue>
											</S.DetailValue>
											<S.DetailValue widthPercentage={widthPercentage}>
												<p>{convertCamelCase(mintOrderLine.status.type)}</p>
											</S.DetailValue>
											<S.DetailValue widthPercentage={widthPercentage}>
												<p>{`${mintOrderLine.fee} ${language.arTokens}`}</p>
											</S.DetailValue>
										</S.DetailLine>
									);
								})}
							</React.Fragment>
						);
					})}
				</S.DetailWrapper>
			);
		}
	}

	function getData() {
		return (
			<S.Content>
				{getHeader()}
				{getDetail()}
			</S.Content>
		);
	}

	return (
		<S.Wrapper>
			<Drawer title={props.title} content={getData()} />
		</S.Wrapper>
	);
}

function groupByStatusType(array: MintOrderLineType[]) {
	const grouped: any = {};

	array.forEach((item) => {
		const type = item.status.type;

		if (!grouped[type]) {
			grouped[type] = [];
		}

		grouped[type].push(item);
	});

	const sortedGrouped: any = {};

	if (grouped.confirmed) {
		sortedGrouped.confirmed = grouped.confirmed;
	}

	if (grouped.pending) {
		sortedGrouped.pending = grouped.pending;
	}
	
	Object.keys(grouped).forEach((key) => {
		if (!sortedGrouped.hasOwnProperty(key)) {
			sortedGrouped[key] = grouped[key];
		}
	});

  return sortedGrouped;
}
