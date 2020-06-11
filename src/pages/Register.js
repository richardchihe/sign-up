import React, { useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';

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

const registerReducer = (state, action) => {
  switch (action.type) {
    case 'field': {
      if (action.field === 'confirmPassword') {
        if (state.password !== action.value) {
          return {
            ...state,
            error: 'Password do not match',
            [action.field]: action.value,
          };
        } else {
          return {
            ...state,
            error: '',
            [action.field]: action.value,
          };
        }
      }
      return {
        ...state,
        [action.field]: action.value,
      };
    }
    case 'register': {
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
      };
    }
    default: 
      break;
  }
  return state;
}

const initialState = {
  username: '',
  email: '',
  password: '',
  isLoading: false,
  error: ''
}

const Register = () => {
  const classes = useStyles();
  const history = useHistory();
  const [state, dispatch] = useReducer(registerReducer, initialState);

  const {
    username,
    email,
    password,
    confirmPassword,
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

    dispatch({type: 'register'});

    AuthService.register(
      username,
      email,
      password
    ).then(
      response => {
        dispatch({
          type: 'success',
        });

        history.push("/login");
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
    <>
      <Card className={classes.paper}>
        <CardContent>
          <Avatar className={classes.avatar}>
            <EmojiPeopleIcon />
          </Avatar>
          <Typography align="center"  component="h1" variant="h5">
            Sign Up
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
              label="Username"
              name="username"
              autoFocus
              value={username}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Re-type Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
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
                !isLoading ? 'Sign Up' :
                  <CircularProgress className={classes.loading}/> 
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default Register;