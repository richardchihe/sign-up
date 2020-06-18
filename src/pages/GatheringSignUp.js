import React, { useEffect, useReducer } from 'react'; 
import Container from '@material-ui/core/Container';
import AttendeesTable from '../components/tables/AttendeesTable';
import GatheringSignUpContainer from '../components/containers/GatheringSignUpContainer';
import GatheringService from '../services/gathering.service';

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
    isLoading,
    error
  } = state;

  useEffect(() => {
    document.title = "Sign Up";
    GatheringService.getGathering(
      props.match.params.id
    ).then(
      response => {
        console.log(response);
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
  }, []);

  return (
    <Container style={{height: '100vh', display: 'flex'}}>
      <GatheringSignUpContainer gathering={gathering}/>
    </Container>
  )
}
  
export default GatheringSignUp;