export const STYLING = {
  cutoffs: {
    initial: '1024px',
    initialWrapper: '1200px',
    tablet: '840px',
    secondary: '540px',
    max: '1400px',
    mobileLandscape: '600px',
  },
  dimensions: {
    borderRadius: '20px',
    borderRadiusField: '5.25px',
    borderRadiusWrapper: '10.25px',
    buttonHeight: '42.5px',
    buttonWidth: '150px',
    listWidth: '600px',
    listDetailWidth: '500px',
    navHeight: '70px',
    footerHeight: '50px',
    formHeightMin: '37.5px',
    formHeightSm: '42.5px',
    formHeightMax: '55px',
    formWidthMin: '300px',
    formWidthMax: '500px',
    messagingContent: '650px',
    wrapWidth: '675px',
  },
};

export function getImageShadow(theme: any) {
  return `0 0 5px ${theme.colors.transparent};`;
}
