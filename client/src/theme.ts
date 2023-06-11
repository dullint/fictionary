import {
  createTheme,
  PaletteOptions,
  responsiveFontSizes,
  Theme,
} from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';

const typography: TypographyOptions = {
  h1: {
    fontFamily: 'bespoke-extrabold-italic',
  },
  h2: {
    fontFamily: 'bespoke-extrabold-italic',
  },
  h3: {
    fontFamily: 'bespoke-extrabold-italic',
  },
  h4: {
    fontFamily: 'bespoke-extrabold-italic',
  },
  h5: {
    fontFamily: 'bespoke-extrabold-italic',
  },
  h6: {
    fontFamily: 'bespoke-extrabold-italic',
  },
  subtitle1: {
    fontFamily: 'bespoke-medium',
  },
  subtitle2: {
    fontFamily: 'bespoke-medium',
  },
  body1: {
    fontFamily: 'bespoke-regular',
  },
  body2: {
    fontFamily: 'bespoke-regular',
  },
  button: {
    fontFamily: 'bespoke-medium',
    textTransform: 'none',
    fontSize: 20,
  },
} as TypographyOptions;

declare module '@mui/material/styles' {
  interface Palette {
    green: Palette['primary'];
    yellow: Palette['primary'];
    black: Palette['primary'];
    pink: Palette['primary'];
    blue: Palette['primary'];
  }
  interface PaletteOptions {
    green: PaletteOptions['primary'];
    yellow: PaletteOptions['primary'];
    black: PaletteOptions['primary'];
    pink: PaletteOptions['primary'];
    blue: PaletteOptions['primary'];
  }

  interface PaletteColor {
    darker?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
  }
  interface PaletteColorOptions {
    darker?: string;
    main: string;
    contrastText?: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    black: true;
  }
}

export const palette: PaletteOptions = {
  primary: {
    main: '#90C8AC',
  },
  secondary: {
    main: '#D89A9E',
  },
  green: {
    main: '#90C8AC',
    darker: '#619B8A',
  },
  yellow: {
    main: '#F2E7D5',
    darker: '#e6daca',
  },
  pink: {
    main: '#D89A9E',
  },
  blue: {
    main: '#86BAFE',
  },
  black: {
    main: '#666666',
    contrastText: '#fff',
  },
};

const components = {
  MuiButton: {
    styleOverrides: {
      contained: {
        borderRadius: 30,
      },
      outlined: {
        borderRadius: 30,
      },
    },
  },
  MuiInput: {
    defaultProps: {
      disableUnderline: true,
    },
    styleOverrides: {
      root: {
        border: '2px solid black',
        borderRadius: 10,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 4,
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: palette.secondary.main,
        fontSize: 20,
        align: 'center',
        border: '2px solid black',
      },
      arrow: {
        color: palette.secondary.main,
        '&:before': {
          border: '2px solid black',
        },
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        borderColor: 'black',
        border: '1px solid black',
      },
    },
  },
};

export const themeParameters = {
  typography,
  palette,
  components,
};

export const theme = createTheme(themeParameters);

export const getTheme = (): Theme => {
  return responsiveFontSizes(theme);
};
