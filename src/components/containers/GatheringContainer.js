import React, { useContext, useEffect, useReducer } from 'react'; 
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Link } from 'react-router-dom'; 

import Alert from '../dialogs/Alert';
import { AppDispatchContext } from '../../contexts/app.context';
import GatheringService from "../../services/gathering.service";
import BasicPrompt from '../dialogs/BasicPrompt';
import FormPrompt from '../dialogs/FormPrompt';
import GatheringForm from '../forms/GatheringForm';

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
    case 'setAttendeesCount': {
      return {
        ...state,
        attendeesCount: action.count,
        prompt: ''
      };
    }
    case 'archiveGathering': {
      return {
        ...state,
        prompt: 'archive'
      };
    }
    case 'closeGathering': {
      return {
        ...state,
        prompt: 'close'
      };
    }
    case 'setPrompt': {
      return {
        ...state,
        prompt: action.prompt
      };
    }
    case 'error': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
        prompt: ''
      };
    }
    default: 
      break;
  }
  return state;
}

const initialState = {
  gathering: null,
  attendeesCount: 0,
  isLoading: false,
  prompt: '',
  error: ''
}

const GatheringContainer = (props) => { 
  const classes = useStyles();
  const [state, dispatch] = useReducer(containerReducer, initialState);
  const { dispatch: appDispatch } = useContext(AppDispatchContext);

  let {
    gathering,
    attendeesCount,
    isLoading,
    prompt,
    error
  } = state;

  useEffect(() => {
    dispatch({type: 'setGathering', gathering: props.gathering});
  }, []);

  useEffect(() => {
    GatheringService.getAttendeesCount(
      props.gathering._id
    ).then(
      response => {
        dispatch({type: 'setAttendeesCount', count: response.attendeesCount});
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
  }, [gathering]);

  const handleClick = (action) => {
    switch (action) {
      case 'toggleArchiveGathering': {
        GatheringService.toggleArchiveStatus(
          gathering._id,
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
        break;
      }
      case 'toggleOpenGathering': {
        GatheringService.toggleOpenStatus(
          gathering._id,
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
        break;
      }
      default: 
        break;
    }
  }

  return (
    <>
      {error && (
        <Alert isOpen={true} message={error} close={() => {dispatch({type: 'error', error: ''})}} />
      )}
      {(prompt === 'close') && (
        <BasicPrompt
          isOpen={true}
          title={`Close gathering ${gathering.title}`}
          message={"Are you sure?"}
          cancel={() => dispatch({type: 'setPrompt', prompt: ''})}
          confirm={() => {handleClick('toggleOpenGathering')}}
        />
      )}
      {(prompt === 'archive') && (
        <BasicPrompt
          isOpen={true}
          title={`Archive gathering ${gathering.title}`}
          message={"Are you sure?"}
          cancel={() => dispatch({type: 'setPrompt', prompt: ''})}
          confirm={() => {handleClick('toggleArchiveGathering')}}
        />
      )}
      {(prompt === 'update') && (
        <FormPrompt 
          isOpen={true} 
          title={`Update ${gathering.title}`} 
          form={<GatheringForm gathering={gathering} success={(result) => {dispatch({type: 'setGathering', gathering: result})}} /> }
          cancel={() => {dispatch({type: 'setPrompt', prompt: ''})}}
        />
      )}
      {gathering && (
        <Grid item key={gathering._id} xs={12} sm={6} md={3}>
          <Card>
            <CardHeader
              style={{
                backgroundColor: gathering.isArchived ? 'lightgray' : 'antiquewhite'
              }}
              title={gathering.title}
              subheader={moment(gathering.date).format("MMM D, YYYY")}
              titleTypographyProps={{ align: 'center' }}
              subheaderTypographyProps={{ variant: 'h6', align: 'center' }}
              action={true ? (
                <>
                  <Button 
                    disabled={gathering.isArchived || gathering.isOpen}
                    className={classes.view}
                    onClick={() => {dispatch({type: 'setPrompt', prompt: 'update'})}}
                  >
                    <EditIcon />
                  </Button>
                  <a href={`/signup/gathering/${gathering._id}`} target="_blank">
                    <Button 
                      className={classes.view}>
                      <VisibilityIcon />
                    </Button>
                  </a>
                </>
              ) : null}
              className={classes.cardHeader}
            />
            <CardContent className={classes.cardContent}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <FormControlLabel
                  disabled={gathering.isArchived}
                  control={
                    <Switch
                      checked={gathering.isOpen}
                      onChange={
                        () => {
                          if (gathering.isOpen) {
                            dispatch({type: 'closeGathering'});
                          } else {
                            handleClick('toggleOpenGathering');
                          }
                        }
                      }
                      name="isArchived"
                      color="secondary"
                    />
                  }
                  label={gathering.isOpen ? "Open" : "Closed"}
                />
                <FormControlLabel
                  style={{flexDirection: 'row-reverse'}}
                  control={
                    <Switch
                      checked={!gathering.isArchived}
                      onChange={
                        () => {
                          if (gathering.isArchived) {
                            handleClick('toggleArchiveGathering');
                          } else {
                            dispatch({type: 'archiveGathering'});
                          }
                        }
                      }
                      name="isArchived"
                      color="primary"
                    />
                  }
                  label={gathering.isArchived ? "Archived" : "Active"}
                />
              </div>
              <div className={classes.cardPricing}>
                
                <Typography component="h2" variant="h3" color="textPrimary">
                  {attendeesCount}/{gathering.seatingCapacity}
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
            {/* <CardActions>
              {!state.currentUser && (
                <Button fullWidth variant="outlined" color="primary" onClick={() => {props.click(gathering.title)}}>
                  Sign Up
                </Button>
              )}
              {state.currentUser.isModerator && (
                <Button fullWidth variant="outlined" color="primary" onClick={() => {props.click(gathering.title)}}>
                  Actions
                </Button>
              )}
            </CardActions> */}
          </Card>
        </Grid>
      )}
    </>
  )
}
  
export default GatheringContainer;