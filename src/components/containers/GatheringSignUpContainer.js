import React, { useContext, useEffect, useReducer } from 'react'; 
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import moment from 'moment';

import Alert from '../dialogs/Alert';
import { AppDispatchContext } from '../../contexts/app.context';
import { SignUpStateContext, SignUpDispatchContext } from '../../contexts/signUp.context';
import GatheringService from "../../services/gathering.service";
import BasicPrompt from '../dialogs/BasicPrompt';
import FormPrompt from '../dialogs/FormPrompt';
import SignUpForm from '../forms/SignUpForm';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  cardContent: {
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  view: {
    minWidth: 'fit-content',
    padding: '0px'
  }
}));

const containerReducer = (state, action) => {
  switch (action.type) {
    case 'setGathering': {
      return {
        ...state,
        gathering: action.gathering,
        prompt: ''
      };
    }
    case 'setPrompt': {
      return {
        ...state,
        prompt: action.prompt
      };
    }
    case 'success': {
      console.log("Got here!");
      return {
        ...state,
        isLoading: false,
        prompt: '',
        fetchedAt: new Date()
      };
    }
    case 'error': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
        prompt: '',
        fetchedAt: new Date()
      };
    }
    default: 
      break;
  }
  return state;
}

const initialState = {
  gathering: null,
  isLoading: false,
  prompt: '',
  error: '',
  fetchedAt: null
}

const GatheringSignUpContainer = (props) => { 
  const classes = useStyles();
  const [state, dispatch] = useReducer(containerReducer, initialState);
  // const { state: signUpState } = useContext(SignUpStateContext);
  // const { dispatch: signUpDispatch } = useContext(SignUpDispatchContext);

  let {
    gathering,
    isLoading,
    prompt,
    error,
    fetchedAt
  } = state;

  useEffect(() => {
    dispatch({type: 'setGathering', gathering: props.gathering});
  }, [props.gathering]);

  useEffect(() => {
    if (gathering) {
      GatheringService.getGathering(
        gathering._id
      ).then(
        response => {
          dispatch({type: 'setGathering', gathering: response});
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
  }, [fetchedAt]);

  return (
    <SignUpDispatchContext.Provider value={{dispatch}}>
      <SignUpStateContext.Provider value={{state}}>
        {error && (
          <Alert isOpen={true} message={error} close={() => {dispatch({type: 'error', error: ''})}} />
        )}
        {(prompt === 'signup') && (
          <FormPrompt 
            isOpen={true} 
            title={`Signing up for ${gathering.title}`} 
            form={<SignUpForm gathering={gathering} /> }
            cancel={() => {dispatch({type: 'setPrompt', prompt: ''})}}
          />
        )}
        {(gathering && !gathering.isArchived) && (
          <Grid style={{margin: 'auto', paddingTop: '1em'}} item key={gathering._id} xs={12} sm={6} md={3}>
            <Card>
              <CardHeader
                style={{backgroundColor: 'antiquewhite'}}
                title={gathering.title}
                subheader={moment(gathering.date).format("MMM D, YYYY")}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ variant: 'h6', align: 'center' }}
                className={classes.cardHeader}
              />
              <CardContent className={classes.cardContent}>
                <div className={classes.cardPricing}>
                  <Typography component="h2" variant="h3" color="textPrimary">
                    {gathering.attendeesCount}/{gathering.seatingCapacity}
                  </Typography>
                </div>
                <ul>
                  <Typography component="li" variant="subtitle1" align="center">
                    {`${moment(gathering.from).format("hh:mm A")} - ${moment(gathering.to).format("hh:mm A")}`}
                  </Typography>
                  <hr />
                  {gathering.description.map((line) => (
                    <Typography component="li" variant="subtitle1" align="center" key={line}>
                      {line}
                    </Typography>
                  ))}
                </ul>
              </CardContent>
              <CardActions>
                <Button disabled={!gathering.isOpen || (gathering.attendeesCount >= gathering.seatingCapacity)} fullWidth variant="outlined" color="primary"
                  onClick={() => {dispatch({type: 'setPrompt', prompt: 'signup'})}}
                >
                  {!gathering.isOpen ? 'Closed' : 
                    (gathering.attendeesCount >= gathering.seatingCapacity) ? 'Full' : 'Sign Up'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}
      </SignUpStateContext.Provider>
    </SignUpDispatchContext.Provider>
  )
}
  
export default GatheringSignUpContainer;