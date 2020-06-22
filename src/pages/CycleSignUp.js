import React, { useEffect, useReducer } from 'react'; 
import Container from '@material-ui/core/Container';
import GatheringSignUpContainer from '../components/containers/GatheringSignUpContainer';
import CycleService from '../services/cycle.service';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '../components/dialogs/Alert';

const singUpReducer = (state, action) => {
  switch (action.type) {
    case 'setCycle': {
      return {
        ...state,
        cycle: action.cycle,
        prompt: ''
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
  cycle: null,
  isLoading: false,
  error: ''
}
  
const CycleSignUp = (props) => { 
  const [state, dispatch] = useReducer(singUpReducer, initialState);
  let {
    cycle,
    isLoading,
    error
  } = state;

  useEffect(() => {
    document.title = "Sign Up";
    CycleService.getCycleAndActiveGatherings(
      props.match.params.id
    ).then(
      response => {
        dispatch({type: 'setCycle', cycle: response});
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
  }, []);

  return (
    <Container style={{height: '100vh', display: 'flex'}}>
      {error && (
        <Alert isOpen={true} message={error} close={() => {dispatch({type: 'error', error: ''})}} />
      )}
      {(cycle && cycle.gatherings) ? (
        <Grid 
          style={{alignItems: 'center'}}
          container 
          spacing={2} 
          alignItems="flex-end">
          {cycle.gatherings.map((gathering) => (
            <GatheringSignUpContainer key={gathering._id} gathering={gathering}/>
          ))}
        </Grid>
      ) : (
        <CircularProgress style={{margin: 'auto'}} />
      )}
    </Container>
  )
}
  
export default CycleSignUp;