import React, { useEffect, useReducer } from 'react'; 
import Container from '@material-ui/core/Container';
import GatheringSignUpContainer from '../components/containers/GatheringSignUpContainer';
import GatheringService from '../services/gathering.service';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '../components/dialogs/Alert';

const singUpReducer = (state, action) => {
  switch (action.type) {
    case 'setGathering': {
      return {
        ...state,
        gathering: action.gathering,
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
  gathering: null,
  isLoading: false,
  error: ''
}
  
const GatheringSignUp = (props) => { 
  const [state, dispatch] = useReducer(singUpReducer, initialState);
  let {
    gathering,
    error
  } = state;

  useEffect(() => {
    document.title = "Sign Up";
    GatheringService.getGathering(
      props.match.params.id
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
  }, [props]);

  return (
    <Container style={{height: '100vh', display: 'flex'}}>
      {error && (
        <Alert isOpen={true} message={error} close={() => {dispatch({type: 'error', error: ''})}} />
      )}
      {gathering ? (
        <GatheringSignUpContainer gathering={gathering}/>
      ) : (
        <CircularProgress style={{margin: 'auto'}} />
      )}
    </Container>
  )
}
  
export default GatheringSignUp;