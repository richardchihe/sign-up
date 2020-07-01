import React, { useContext, useReducer } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';

import { AppStateContext } from '../../contexts/app.context';
import Alert from '../dialogs/Alert';
import CheckerService from '../../services/checker.service';

const useStyles = makeStyles((theme) => ({
  paper: {
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

const checkerReducer = (state, action) => {
  switch (action.type) {
    case 'field': {
      return {
        ...state,
        [action.field]: action.value,
      };
    }
    case 'togglePasswordVisibility': {
      return {
        ...state,
        showPassword: !state.showPassword
      };
    }
    case 'create': {
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
        error: action.error
      };
    }
    default: 
      break;
  }
  return state;
}

const initialState = {
  password: '',
  showPassword: false,
  isLoading: false,
  error: ''
}

const NewPassword = (props) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(checkerReducer, initialState);
  const { state: appState } = useContext(AppStateContext);

  const {
    password,
    showPassword,
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
    dispatch({type: 'create'});
    console.log(props.id);
    CheckerService.setPassword(
      props.id,
      password
    ).then(
      response => {
        console.log(response);
        props.success();
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(error.response.data);
        console.log(resMessage);
        if (resMessage.code) {
          dispatch({type: 'error', error: `${resMessage.name} ${resMessage.code}`});
        } else {
          dispatch({type: 'error', error: resMessage});
        }
        
      }
    );
  }

  return (
    <>
      <Card className={classes.paper}>
        <CardContent>
          {error && (
            <Alert isOpen={true} message={error} close={() => {dispatch({type: 'error', error: ''})}} />
          )}
          <form className={classes.form} 
            onSubmit={handleSubmit}
          >
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="password">Password *</InputLabel>
              <OutlinedInput
                id="password"
                required
                labelWidth={85}
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                autoComplete="newPassword"
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {dispatch({type: 'togglePasswordVisibility'})}}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                disabled={isLoading}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isLoading}
            >
              
              {
                !isLoading ? 'Set Password' :
                  <CircularProgress className={classes.loading}/> 
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default NewPassword;