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
import moment from 'moment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Alert from '../dialogs/Alert';
import { AppDispatchContext } from '../../contexts/app.context';
import GatheringService from "../../services/gathering.service";
import BasicPrompt from '../dialogs/BasicPrompt';

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
    case 'archiveGathering': {
      return {
        ...state,
        prompt: 'archive'
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
    isLoading,
    prompt,
    error
  } = state;

  useEffect(() => {
    dispatch({type: 'setGathering', gathering: props.gathering});
  }, []);

  const handleClick = (action) => {
    switch (action) {
      case 'toggleArchiveGathering': {
        console.log("Here");
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
      default: 
        break;
    }
  }

  return (
    <>
      {error && (
        <Alert isOpen={true} message={error} close={() => {dispatch({type: 'error', error: ''})}} />
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
                <Button className={classes.view}>
                  <VisibilityIcon />
                </Button>
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
                  control={
                    <Switch
                      checked={gathering.isOpen}
                      onChange={
                        () => {
                          // if (gathering.isArchived) {
                          //   handleClick('toggleArchiveGathering');
                          // } else {
                          //   dispatch({type: 'archiveGathering'});
                          // }
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
                  TBD/{gathering.seatingCapacity}
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