import { keyframes } from 'styled-components';

export const open = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const openLeft = keyframes`
    from {
        left: -100rem;
    }
    to {
        left: 0;
    }
`;

export const loaderKeyFrame = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const loadingSlide = keyframes`
  to {
    background-position: 100% 0, 0 0;
  }
`;

export const fadeIn1 = '250ms cubic-bezier(0, 0, 0.2, 1) 0ms';
export const fadeIn2 = '1000ms cubic-bezier(0, 0, 0.2, 1) 0ms';
