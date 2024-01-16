import { DefaultTheme } from 'styled-components';

const DEFAULT = {
  neutral1: '#FFFFFF',
  neutral2: '#F2F3F4',
  neutral3: '#F0F0F0',
  neutral4: '#3A3A3A',
  neutral5: '#D0D7DE',
  neutral6: '#D9D9D9',
  neutral7: '#777777',
  neutral8: '#717171',
  neutral9: '#F6F8FA',
  neutral10: '#BABABA',
  neutral11: '#000000',
  neutral12: '#FAFAFA',
  neutral13: '#F7F7F7',
  neutral14: '#FFFFFF',
  neutral15: '#536471',
  neutral16: '#F0F9FE',
  primary: '#436a99',
  primary2: '#278490',
  primary3: '#385880',
  primary4: '#3FBACA',
  primary5: '#F3FDFF',
  alt1: '#EC7F00',
  alt2: '#EC7F00',
  overlay1: 'rgba(255, 255, 255, 0.75)',
  negative: '#D24646',
  negativeHover: '#F26969',
  negativeShadow: '#F27979',
  positive: '#48D67C',
  positiveHover: '#37FB72',
  neutral: '#FFB600',
  transparent: 'rgba(255, 255, 255, 0)',
  semiTransparent: 'rgba(255, 255, 255, 0.5)',
  backdropShadow1: '#c4c4c4b0',
  backdropShadow2: '#dadadaba',
};

export const defaultTheme: DefaultTheme = {
  scheme: 'light',
  colors: {
    accordion: {
      background: DEFAULT.neutral1,
      hover: DEFAULT.neutral9,
      color: DEFAULT.neutral4,
    },
    border: {
      primary: DEFAULT.neutral5,
      alt1: DEFAULT.primary3,
      alt2: DEFAULT.primary4,
      alt3: DEFAULT.neutral6,
    },
    button: {
      primary: {
        background: DEFAULT.neutral1,
        border: DEFAULT.primary,
        hover: DEFAULT.neutral9,
        label: DEFAULT.primary,
        active: {
          background: DEFAULT.primary,
          hover: DEFAULT.primary2,
          label: DEFAULT.neutral1,
        },
        disabled: {
          background: DEFAULT.neutral5,
          border: DEFAULT.neutral3,
          label: DEFAULT.neutral7,
        },
      },
      alt1: {
        background: DEFAULT.primary,
        border: DEFAULT.transparent,
        hover: DEFAULT.primary3,
        label: DEFAULT.neutral1,
        active: {
          background: DEFAULT.neutral1,
          hover: DEFAULT.neutral9,
          label: DEFAULT.primary,
        },
        disabled: {
          background: DEFAULT.neutral5,
          border: DEFAULT.neutral3,
          label: DEFAULT.neutral7,
        },
      },
      alt2: {
        background: DEFAULT.neutral1,
        border: DEFAULT.neutral5,
        hover: DEFAULT.neutral2,
        label: DEFAULT.primary,
        active: {
          background: DEFAULT.primary3,
          hover: DEFAULT.primary2,
          label: DEFAULT.neutral1,
        },
        disabled: {
          background: DEFAULT.neutral13,
          border: DEFAULT.neutral3,
          label: DEFAULT.neutral7,
        },
      },
      success: {
        background: DEFAULT.positive,
        hover: DEFAULT.positiveHover,
      },
      warning: {
        color: DEFAULT.negative,
        hover: DEFAULT.negativeHover,
      },
      disabled: DEFAULT.neutral4,
    },
    checkbox: {
      active: {
        background: DEFAULT.primary2,
      },
      background: DEFAULT.neutral1,
      hover: DEFAULT.neutral9,
      border: DEFAULT.neutral5,
      disabled: DEFAULT.neutral5,
    },
    container: {
      primary: {
        background: DEFAULT.neutral1,
        hover: DEFAULT.neutral9,
      },
      alt1: {
        background: DEFAULT.primary,
      },
      alt2: {
        background: DEFAULT.neutral7,
      },
      alt3: {
        background: DEFAULT.neutral9,
      },
      alt4: {
        background: DEFAULT.neutral4,
      },
      alt5: {
        background: DEFAULT.neutral11,
      },
      alt6: {
        background: DEFAULT.neutral5,
      },
      alt7: {
        background: DEFAULT.primary5,
      },
      alt8: {
        background: DEFAULT.neutral6,
      },
    },
    font: {
      primary: {
        base: DEFAULT.neutral1,
        alt1: DEFAULT.neutral4,
        alt2: DEFAULT.alt1,
        alt3: DEFAULT.alt2,
        alt4: DEFAULT.primary3,
        alt5: DEFAULT.primary4,
        alt6: DEFAULT.neutral7,
        alt7: DEFAULT.neutral8,
        alt8: DEFAULT.neutral11,
        alt9: DEFAULT.neutral15,
        alt10: DEFAULT.neutral5,
        alt11: DEFAULT.primary2,
        active: {
          base: DEFAULT.primary,
          hover: DEFAULT.primary3,
        },
        invalid: DEFAULT.negative,
        positive: DEFAULT.positive,
        negative: DEFAULT.negative,
      },
    },
    form: {
      background: DEFAULT.neutral1,
      border: DEFAULT.neutral6,
      invalid: {
        outline: DEFAULT.negative,
        shadow: DEFAULT.negativeShadow,
      },
      valid: {
        outline: DEFAULT.primary3,
        shadow: DEFAULT.primary4,
      },
      disabled: {
        background: DEFAULT.neutral2,
        label: DEFAULT.neutral7,
      },
    },
    icon: {
      primary: {
        fill: DEFAULT.neutral1,
        hover: DEFAULT.neutral6,
        alt1: {
          fill: DEFAULT.neutral7,
        },
        alt2: {
          fill: DEFAULT.primary2,
        },
      },
      alt1: {
        fill: DEFAULT.primary,
      },
      alt2: {
        fill: DEFAULT.neutral4,
      },
      inactive: DEFAULT.neutral4,
      info: {
        background: DEFAULT.negative,
        border: DEFAULT.neutral7,
      },
    },
    image: {
      shadow1: DEFAULT.backdropShadow1,
      shadow2: DEFAULT.backdropShadow2,
    },
    indicator: {
      active: {
        base: DEFAULT.primary,
        hover: DEFAULT.primary2,
      },
      inactive: {
        base: DEFAULT.neutral6,
        hover: DEFAULT.neutral8,
      },
    },
    loader: {
      primary: DEFAULT.primary2,
    },
    navigation: {
      footer: {
        background: DEFAULT.neutral1,
      },
      header: {
        background: DEFAULT.neutral1,
        logoFill: DEFAULT.neutral11,
      },
    },
    notification: {
      success: DEFAULT.positive,
      warning: DEFAULT.negative,
      neutral: DEFAULT.neutral,
    },
    overlay: {
      primary: DEFAULT.overlay1,
    },
    orderLine: {
      confirmed: {
        background: DEFAULT.neutral7,
      },
      default: {
        background: DEFAULT.neutral1,
      },
      header: {
        background: DEFAULT.neutral2,
      },
      ownerLine: {
        background: DEFAULT.neutral9,
      },
      pending: {
        background: DEFAULT.neutral2,
      },
      subheader: {
        background: DEFAULT.neutral1,
      },
    },
    shadow: {
      primary: DEFAULT.neutral9,
    },
    table: {
      placeholder: {
        background: DEFAULT.neutral9,
        backgroundStart: DEFAULT.transparent,
        backgroundSlide: DEFAULT.semiTransparent,
        backgroundEnd: DEFAULT.transparent,
      },
      row: {
        active: {
          background: DEFAULT.neutral16,
          border: DEFAULT.primary4,
        },
      },
    },
    tabs: {
      active: DEFAULT.alt1,
      inactive: DEFAULT.neutral3,
      hover: DEFAULT.neutral3,
      alt1: {
        active: DEFAULT.alt1,
      },
    },
    transparent: DEFAULT.transparent,
    view: {
      background: DEFAULT.neutral1,
    },
    warning: DEFAULT.negative,
  },
  typography: {
    family: {
      primary: `'DM Sans', sans-serif`,
      alt1: `'Space Grotesk', sans-serif;`,
    },
    size: {
      h1: '48px',
      h2: '24px',
      lg: '18px',
      base: '16px',
      small: '15px',
      xSmall: '14px',
      xxSmall: '13px',
    },
    weight: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
  },
};
