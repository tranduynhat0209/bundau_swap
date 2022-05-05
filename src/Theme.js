import React from "react";
import { createTheme, CssBaseline, responsiveFontSizes, ThemeProvider } from "@material-ui/core";
import { useAppContext } from "./context/app-context";
import { useMemo } from "react";

const baseTheme = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*": {
          boxSizing: "border-box",
          margin: 0,
          padding: 0,
        },
        html: {
          "-webkit-font-smoothing": "antialiased",
          "-moz-osx-font-smoothing": "grayscale",
        },
        body: {
          fontFamily: "'Kanit', sans-serif",
        },
        ".second-font": {
          fontFamily: "'Fira Code', monospace",
        },
        "#root": {
          height: "100%",
          width: "100%",
        },
        ".MuiButtonBase-root.Mui-disabled": {
          cursor: "not-allowed",
          pointerEvents: "auto",
        },
        ".MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
          cursor: "not-allowed",
          pointerEvents: "auto",
        },
      },
    },
    MuiButton: {
      root: {
        textTransform: "none",
        borderRadius: 10,
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 10,
      },
    },
    MuiInput: {
      root: {
        borderRadius: 10,
      },
    },
    MuiInputBase: {
      root: {
        borderRadius: 10,
      },
      input: {
        borderRadius: 10,
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 10,
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: 12,
      },
    },
    MuiBackdrop: {
      root: {
        backdropFilter: "blur(8px)",
      },
    },
  },
  props: {
    MuiButton: {
      disableElevation: true,
    },
  },
};

export default function Theme(props) {
  const { themeMode } = useAppContext();
  const isDarkMode = themeMode === "dark";

  const theme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme(
          {
            typography: {
              fontFamily: "'Kanit', sans-serif",
            },
            mode: themeMode,
            ...(isDarkMode
              ? {
                  palette: {
                    background: {
                      paper: "#122719",
                      primary: "#122719",
                      secondary: "#387277",
                      primaryGradient: "linear-gradient(180deg, rgba(0, 68, 6, 0.5) 0%, rgba(0, 68, 6, 0.5) 100%)",
                    },
                    primary: { main: "#4dffa3", button: "#00D6F2" },
                    secondary: { main: "#72a77b", light: "#C5F9DA", button: "#387277" },
                    text: {
                      primary: "#FFFFFF",
                      secondary: "#FFFFFFA6",
                      disabled: "rgba(255, 255, 255, 0.38)",
                    },
                    action: {
                      disabled: "rgba(255, 255, 255, 0.26)",
                      disabledBackground: "rgba(255, 255, 255, 0.12)",
                    },
                  },
                  overrides: {
                    MuiButton: {
                      containedPrimary: {
                        color: "#FFFFFF",
                      },
                    },
                    MuiInputBase: {
                      root: {
                        background: "#091c09",
                      },
                    },
                    MuiOutlinedInput: {
                      root: {
                        "&:hover $notchedOutline": {
                          borderColor: "#27eb00",
                        },
                      },
                      notchedOutline: {
                        borderColor: "rgba(255, 255, 255, 0.23)",
                      },
                    },
                    MuiSkeleton: {
                      wave: {
                        "&::after": {
                          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.04), transparent)",
                        },
                      },
                    },
                    MuiDivider: {
                      root: {
                        backgroundColor: "rgba(255, 255, 255, 0.23)",
                      },
                    },
                  },
                }
              : {
                  palette: {
                    background: {
                      paper: "#F5FBFB",
                      primary: "#F5FBFB",
                      secondary: "#387277",
                      primaryGradient: "linear-gradient(175.06deg, #E3F2E9 4.91%, #dcfce4 86.43%)",
                    },
                    primary: { main: "#00993e", button: "#00D6F2" },
                    secondary: { main: "#72a77b", light: "#565857", button: "#387277" },
                    text: {
                      primary: "#043947",
                      secondary: "#000000A6",
                      disabled: "rgba(0, 0, 0, 0.38)",
                    },
                  },
                  overrides: {
                    MuiButton: {
                      containedPrimary: {
                        color: "#FFFFFF",
                      },
                    },
                    MuiInputBase: {
                      root: {
                        background: "#dcfce4",
                      },
                    },
                    MuiOutlinedInput: {
                      root: {
                        "&:hover $notchedOutline": {
                          borderColor: "#00e253",
                        },
                      },
                      notchedOutline: {
                        borderColor: "rgba(0, 0, 0, 0.23)",
                      },
                    },
                    MuiDivider: {
                      root: {
                        backgroundColor: "rgba(0, 0, 0, 0.23)",
                      },
                    },
                    MuiAvatar: {
                      colorDefault: {
                        backgroundColor: "#122627",
                      },
                    },
                  },
                }),
          },
          baseTheme
        )
      ),
    [themeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
}
