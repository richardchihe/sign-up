import React, { useReducer, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';

import { AppDispatchContext } from '../contexts/app.context';
import AuthService from "../services/auth.service";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: 'cornflowerblue',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: 'cornflowerblue',
		height: '3em'
  },
  dialog: {
    minWidth: '300px'
  },
	loading: {
		width: '2em !important',
		height: 'auto !important'
	}
}));

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'field': {
      return {
        ...state,
        [action.field]: action.value,
      };
    }
    case 'login': {
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    }
    case 'success': {
      return {
        ...state,
        isLoading: false,
        error: '',
      };
    }
    case 'error': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
        username: '',
        password: ''
      };
    }
    default: 
      break;
  }
  return state;
}

const initialState = {
  username: '',
  password: '',
  isLoading: false,
  error: ''
}

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const { dispatch: appDispatch } = useContext(AppDispatchContext);

  const {
    username,
    password,
    isLoading,
    error,
  } = state;

  const handleChange = e => {
    dispatch({
      type: 'field',
      field: e.currentTarget.name,
      value: e.currentTarget.value,
    });
  }

  const handleSubmit = async e =>  {
    e.preventDefault();

    dispatch({type: 'login'});

    AuthService.login(username, password).then(
      response => {
        dispatch({type: 'success'});
        appDispatch({type: 'setUser', user: response});
        if (response.roles.includes("ROLE_MODERATOR")) {
          history.push("/gatherings");
        }
        if (response.roles.includes("ROLE_CHECKER")) {
          history.push("/activeGatherings");
        }
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        dispatch({type: 'error', error: resMessage});
      }
    );
  }

  return (
    <Container>
      <CssBaseline />
      <Card className={classes.paper}>
        <CardContent>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography align="center" component="h1" variant="h5">
            Sign in
          </Typography>
          {error && (
            <Typography align="center" color="secondary" variant="subtitle2">
              {error}
            </Typography>
          )}
          <form className={classes.form} 
            onSubmit={handleSubmit}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              name="username"
              label="Username"
              value={username}
              autoComplete="username"
              autoFocus
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              value={password}
              type="password"
              autoComplete="password"
              onChange={handleChange}
              disabled={isLoading}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isLoading}
            >
              {
                !isLoading ? 'Sign In' :
                  <CircularProgress className={classes.loading}/> 
              }
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link to="/" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Login;