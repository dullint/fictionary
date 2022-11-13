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
  button: {
    fontFamily: 'bespoke-medium',
    textTransform: 'none',
    fontSize: 25,
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
  }
}

export const palette: PaletteOptions = {
  primary: {
    main: '#90C8AC',
  },
  secondary: {
    main: '#86BAFE',
  },
  green: {
    main: '#90C8AC',
    darker: '#619B8A',
  },
  yellow: {
    main: '#F5F0CE',
    darker: '#dbd6b4',
  },
  pink: {
    main: '#D89A9E',
  },
  blue: {
    main: '#86BAFE',
  },
  black: {
    main: '#222222',
  },
};

const components = {
  MuiButton: {
    styleOverrides: {
      contained: {
        borderRadius: 10,
        boxShadow: '5px 5px black',
        border: '2px solid black',
        '&:hover': {
          backgroundColor: palette.primary.main,
        },
        color: palette.black.main,
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
