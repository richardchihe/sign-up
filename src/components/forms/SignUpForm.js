import React, { useReducer, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';

import Alert from '../dialogs/Alert';
import AttendeeService from '../../services/attendee.service';
import { SignUpDispatchContext } from '../../contexts/signUp.context';

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

const singUpReducer = (state, action) => {
  switch (action.type) {
    case 'field': {
      return {
        ...state,
        [action.field]: action.value,
      };
    }
    case 'signUp': {
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
        success: action.success,
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
  name: '',
  contact: '',
  isLoading: false,
  success: '',
  error: ''
}

const SignUpForm = (props) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(singUpReducer, initialState);
  const {dispatch: signUpDispatch} = useContext(SignUpDispatchContext);

  let {
    name,
    contact,
    isLoading,
    success,
    error
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
    dispatch({type: 'signUp'});
    AttendeeService.signUp(
      props.gathering._id,
      props.gathering.cycleId,
      name,
      contact
    ).then(
      response => {
        dispatch({type: 'success', success: `You (${response.name}) have successfully signed up!`});
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        if (error.response.data.error === 'full') {
          signUpDispatch({type: 'error', error: resMessage});
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
            <Alert isOpen={true} title="Failed!" message={error} close={() => dispatch({type: 'error', error: ''})} />
          )}
          {success && (
            <Alert isOpen={true} title="Success!" message={success} close={() => signUpDispatch({type: 'success'})} />
          )}
          <form className={classes.form} 
            onSubmit={handleSubmit}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              value={name}
              autoFocus
              onChange={handleChange}
              disabled={isLoading}
            />
            {/* if contact is required */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="contact"
              label="Contact"
              id="contact"
              value={contact}
              onChange={handleChange}
              disabled={isLoading}
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

export default SignUpForm;