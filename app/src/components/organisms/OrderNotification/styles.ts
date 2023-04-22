import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div``;

export const Notification = styled.div`
    margin: 0 0 15px 0;
    p {
        font-size: ${(props) => props.theme.typography.size.small};
        font-weight: ${(props) => props.theme.typography.weight.medium};
        color: ${(props) => props.theme.colors.font.primary.alt1};
    }
`;

export const Content = styled.div`
    width: 100%;
    margin: 0 0 15px 0;
    background: ${(props) => props.theme.colors.container.alt2.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadius};
`;

export const HeaderWrapper = styled.div`
    padding: 10px;
    border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
    margin: 0 0 12.5px 0;
    p {
        font-size: ${(props) => props.theme.typography.size.small};
        font-weight: ${(props) => props.theme.typography.weight.medium};
        color: ${(props) => props.theme.colors.font.primary.base};
    }
`;

export const ContentLine = styled.div`
    padding: 0 10px;
    margin: 0 0 12.5px 0;
    p {
        font-size: ${(props) => props.theme.typography.size.small};
        color: ${(props) => props.theme.colors.font.primary.base};
    }
`;

export const DetailLine = styled(ContentLine)`
    display: flex;
    justify-content: flex-end;
     p {
        font-weight: ${(props) => props.theme.typography.weight.medium};
     }
`;

export const DetailWrapper = styled.div`
    width: 100%;
    display: flex;
`;

export const DetailHeaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
`;

export const DetailBodyWrapper = styled(DetailHeaderWrapper)`

`;

export const WindowWrapper = styled.div`
    padding: 10px;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid ${(props) => props.theme.colors.border.primary};
    p {
        font-size: ${(props) => props.theme.typography.size.small};
        font-weight: ${(props) => props.theme.typography.weight.medium};
        color: ${(props) => props.theme.colors.font.primary.base};
    }
`;

export const FooterMessage = styled.div`
    margin: 0 0 15px 0;
    padding: 10px 10px 12.5px 10px;
    background: ${(props) => props.theme.colors.container.alt4.background};
	border: 1px solid ${(props) => props.theme.colors.border.primary};
	border-radius: ${STYLING.dimensions.borderRadius};
    p {
        font-size: ${(props) => props.theme.typography.size.small};
        color: ${(props) => props.theme.colors.font.primary.base};
        line-height: 1.5;
    }
`;