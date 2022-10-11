import { createTheme, Theme } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';

const typography: TypographyOptions = {
  body1: {
    fontSize: 16,
    lineHeight: '22px',
  },
  body2: {
    fontSize: 14,
    lineHeight: '20px',
  },
  button: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '17px',
  },
  caption: {
    fontSize: 12,
    lineHeight: '14px',
  },
  captionBold: {
    fontWeight: 600,
  },
  h1: {
    fontSize: 96,
    fontWeight: 600,
    lineHeight: '115px',
  },
  h2: {
    fontSize: 60,
    fontWeight: 600,
    lineHeight: '72px',
  },
  h3: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: '58px',
  },
  h4: {
    fontSize: 34,
    fontWeight: 600,
    lineHeight: '41px',
  },
  h5: {
    fontSize: 24,
    fontWeight: 600,
    lineHeight: '29px',
  },
  h6: {
    fontSize: 20,
    fontWeight: 500,
    lineHeight: '23px',
  },
  h6Bold: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: '23px',
  },
  menu: {
    fontSize: 13,
    fontWeight: 600,
    lineHeight: '16px',
  },
  smallText: {
    fontSize: '0.75rem',
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '19px',
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '17px',
  },
  useNextVariants: true,
} as TypographyOptions;

export const themeParameters = {
  typography,
};

export const theme = createTheme(themeParameters);

export const getTheme = (): Theme => {
  return theme;
};
