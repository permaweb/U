import styled from 'styled-components';

export const Wrapper = styled.div``;

export const Info = styled.div``;

export const QA = styled.div`
    margin: 0 0 20px 0;
`;

export const Question = styled.p`
    line-height: 1.5;
    margin: 0 0 10px 0;
    font-size: ${(props) => props.theme.typography.size.lg};
    font-weight: ${(props) => props.theme.typography.weight.bold};
    color: ${(props) => props.theme.colors.font.primary.active.base};
`;

export const Answer = styled.p`
    line-height: 1.5;
    font-size: ${(props) => props.theme.typography.size.base};
    font-weight: ${(props) => props.theme.typography.weight.medium};
    color: ${(props) => props.theme.colors.font.primary.alt1};
`;