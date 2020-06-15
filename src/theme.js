import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#269781",
      dark: "#246F61",
      light: "#67D1BD"
    },
    secondary: {
      main: "#ffcc66"
    }
  },
  status: {
    danger: "orange"
  }
});

export default theme;
