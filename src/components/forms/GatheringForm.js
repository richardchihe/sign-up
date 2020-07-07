import React, { useEffect, useReducer, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';

import Alert from '../dialogs/Alert';
import GatheringService from "../../services/gathering.service";
import { AppStateContext } from '../../contexts/app.context';

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

const gatheringReducer = (state, action) => {
  switch (action.type) {
    case 'setInitialState': {
      return {
        ...state,
        mode: 'update',
        title: action.gathering.title,
        date: moment(action.gathering.date).format("YYYY-MM-DD"),
        from: moment(action.gathering.from).format("HH:mm"),
        to: moment(action.gathering.to).format("HH:mm"),
        seatingCapacity: action.gathering.seatingCapacity,
        description: action.gathering.description,
        requireContact: action.gathering.requireContact,
      };
      
    }
    case 'setSeatingCapacity': {
      return {
        ...state,
        seatingCapacity: action.seatingCapacity,
      };
    }
    case 'field': {
      return {
        ...state,
        [action.field]: action.value,
      };
    }
    case 'checkbox': {
      return {
        ...state,
        [action.field]: !state[`${action.field}`],
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

const today = new Date();

const initialState = {
  mode: 'create',
  title: '',
  date: today.toISOString().split('T')[0],
  from: `${today.getHours().toString().length === 1 ? '0'+today.getHours() : today.getHours()}:${today.getMinutes().toString().length === 1 ? '0'+today.getMinutes() : today.getMinutes()}`,
  to: `${today.getHours().toString().length === 1 ? '0'+today.getHours() : today.getHours()}:${today.getMinutes().toString().length === 1 ? '0'+today.getMinutes() : today.getMinutes()}`,
  seatingCapacity: 50, // Calculate from organization Original capacity
  description: '',
  requireContact: true,
  isLoading: false,
  error: ''
}

const GatheringForm = (props) => {
  const [state, dispatch] = useReducer(gatheringReducer, initialState);
  const { state: appState } = useContext(AppStateContext);

  const {
    mode,
    title,
    date,
    from,
    to,
    seatingCapacity,
    description,
    requireContact,
    isLoading,
    error,
  } = state;

  useEffect(() => {
    if (props.gathering) {
      dispatch({type: 'setInitialState', gathering: props.gathering});
    }
  }, [props]);

  useEffect(() => {
    if (!props.gathering && appState) {
      dispatch({type: 'setSeatingCapacity', seatingCapacity: (appState.organization.seatingCapacity * .2)});
    }
  }, [props, appState]);

  const classes = useStyles();

  const handleChange = e => {
    const target = e.currentTarget;
    if (target.type === 'checkbox') {
      dispatch({
        type: 'checkbox',
        field: target.name
      });
    } else {
      dispatch({
        type: 'field',
        field: target.name,
        value: target.value,
      });
    }
  }

  const handleSubmit = async e =>  {
    e.preventDefault();
    dispatch({type: 'create'});
    if (mode === 'create') {
      GatheringService.createGathering(
        appState.currentUser.organizationId,
        props.cycleId,
        title,
        date,
        from,
        to,
        seatingCapacity,
        description,
        requireContact,
      ).then(
        response => {
          props.success(response);
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
    } else {
      GatheringService.updateGathering(
        props.gathering._id,
        title,
        date,
        from,
        to,
        seatingCapacity,
        description,
        requireContact,
      ).then(
        response => {
          props.success(response);
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
            id="title"
            name="title"
            label="Title"
            value={title}
            autoFocus
            onChange={handleChange}
            disabled={isLoading}
          />
          <TextField
            variant="outlined"
            margin="normal"
            type="date"
            required
            fullWidth
            id="date"
            name="date"
            label="Date"
            value={date}
            onChange={handleChange}
            disabled={isLoading}
          />
          <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
            <TextField
              variant="outlined"
              margin="normal"
              type="time"
              required
              id="from"
              name="from"
              label="From"
              value={from}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              variant="outlined"
              margin="normal"
              type="time"
              required
              id="to"
              name="to"
              label="To"
              value={to}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <TextField
            variant="outlined"
            margin="normal"
            type="number"
            required
            fullWidth
            id="seatingCapacity"
            name="seatingCapacity"
            label="Capacity"
            value={seatingCapacity}
            onChange={handleChange}
            disabled={isLoading}
          />
          <Typography variant="subtitle2" style={{float: 'right'}}>
            Default capacity is recommended
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            rowsMax={4}
            fullWidth
            id="description"
            label="Description"
            name="description"
            value={description}
            onChange={handleChange}
            disabled={isLoading}
          />
          {/* <FormControlLabel
            disabled={isLoading}
            control={
              <Checkbox 
                id="requireContact"
                name="requireContact"
                value={requireContact}
                checked={requireContact}
                color="primary"
                onChange={handleChange} 
              />
            }
            label="Require Contact"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isLoading}
          >
            {
              isLoading ? <CircularProgress className={classes.loading}/>  :
                mode === 'create' ? 'Create' : 'Update'
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default GatheringForm;