import React, { useReducer, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';

import Alert from '../dialogs/Alert';
import OrganizationService from "../../services/organization.service";
import { AppDispatchContext } from '../../contexts/app.context';

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

const organizationReducer = (state, action) => {
  switch (action.type) {
    case 'field': {
      return {
        ...state,
        [action.field]: action.value,
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
  name: '',
  seatingCapacity: '',
  address: '',
  contact: '',
  isLoading: false,
  error: ''
}

const OrganizationForm = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(organizationReducer, initialState);
  const { dispatch: appDispatch } = useContext(AppDispatchContext);

  const {
    name,
    seatingCapacity,
    address,
    contact,
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
    OrganizationService.createOrganization(
      name,
      seatingCapacity,
      address,
      contact
    ).then(
      response => {
        appDispatch({type: 'setUserAndOrganization', user: response.user, organization: response.organization});
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
    <Card className={classes.paper}>
      <CardContent>
        {error && (
          <Alert isOpen={true} message={error} close={() => {dispatch({type: 'error', error: ''})}} />
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
            name="name"
            label="Name"
            value={name}
            autoFocus
            onChange={handleChange}
            disabled={isLoading}
          />
          <TextField
            variant="outlined"
            margin="normal"
            type="number"
            required
            fullWidth
            id="seatingCapacity"
            name="seatingCapacity"
            label="Seating Capacity"
            value={seatingCapacity}
            onChange={handleChange}
            disabled={isLoading}
          />
          <Typography variant="subtitle2" style={{float: 'right'}}>
            *Original seating capacity
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="address"
            name="address"
            label="Address"
            value={address}
            onChange={handleChange}
            disabled={isLoading}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="contact"
            name="contact"
            label="Contact"
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
              !isLoading ? 'Create' :
                <CircularProgress className={classes.loading}/> 
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default OrganizationForm;