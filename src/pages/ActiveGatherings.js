import React, { useEffect, useContext, useReducer } from 'react'; 
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

import Alert from '../components/dialogs/Alert';
import AttendeesTable from '../components/tables/AttendeesTable';
import { AppStateContext } from '../contexts/app.context';
import GatheringService from "../services/gathering.service";

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

const gatheringsReducer = (state, action) => {
  switch (action.type) {
    case 'setGatherings': {
      return {
        ...state,
        gatherings: action.gatherings
      };
    }
    case 'setSelectedGathering': {
      return {
        ...state,
        selectedGathering: action.gathering
      };
    }
    case 'fetchData': {
      return {
        ...state,
        fetchedAt: new Date(),
        prompt: ''
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
      };
    }
    default: 
      break;
  }
  return state;
}

const initialState = {
  gatherings: [],
  selectedGathering: null,
  isLoading: false,
  prompt: '',
  error: '',
  fetchedAt: new Date()
}
  
const Gatherings = () => { 
  const classes = useStyles();
  const [state, dispatch] = useReducer(gatheringsReducer, initialState);
  const { state: appState } = useContext(AppStateContext);

  let {
    gatherings,
    selectedGathering,
    error,
    fetchedAt
  } = state;

  useEffect(() => {
    document.title = "Gatherings";
    dispatch({type: 'fetchData'});
  }, []);

  useEffect(() => {
    if (appState.currentUser) {
      GatheringService.getActiveGatherings(
        appState.currentUser.organizationId,
      ).then(
        response => {
          dispatch({type: 'setGatherings', gatherings: response.gatherings});
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
  }, [fetchedAt, appState]);

  return (
    <>
      {error && (
        <Alert isOpen={true} message={error} close={() => {dispatch({type: 'error', error: ''})}} />
      )}
      <Container style={{marginTop: '1em'}}>
        {selectedGathering ? (
          <>
            <Button variant="outlined" color="primary" onClick={() => {dispatch({type: 'setSelectedGathering', gathering: null})}}>
              <ArrowBackIcon />
            </Button>
            <Typography align="center" component="h2" variant="h3" color="textPrimary">
              {selectedGathering.title}
            </Typography>
            <ul>
              <Typography component="li" variant="subtitle1" align="center">
                {`${moment(selectedGathering.from).format("hh:mm A")} - ${moment(selectedGathering.to).format("hh:mm A")}`}
              </Typography>
            </ul>
            <AttendeesTable gathering={selectedGathering} />
          </>
        ) : (
          <Grid container spacing={2} alignItems="center">
            {gatherings.map((gathering) => (
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
                    <Button fullWidth variant="outlined" color="primary" onClick={() => {dispatch({type: 'setSelectedGathering', gathering})}}>
                      Check
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
          
      </Container>
    </>
  )
}
  
export default Gatherings;