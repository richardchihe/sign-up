import React, { useReducer, useEffect } from 'react';
import './App.scss';
import { 
	BrowserRouter as Router, 
	Route, 
	Switch 
} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import NavBar from './components/navigation/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Gathering from './pages/Gathering';
import Gatherings from './pages/Gatherings';
import ActiveGatherings from './pages/ActiveGatherings';
import GatheringSignUp from './pages/GatheringSignUp';
import CycleSignUp from './pages/CycleSignUp';
import Checkers from './pages/Checkers';

import { AppStateContext, AppDispatchContext } from './contexts/app.context';
import AuthService from './services/auth.service';
import OrganizationService from './services/organization.service';

const appReducer = (state, action) => {
  switch (action.type) {
    case 'setUser': {
      return {
        ...state,
        currentUser: action.user
      };
    }
    case 'setUserAndOrganization': {
      return {
        ...state,
        currentUser: action.user,
        organization: action.organization
      };
    }
    case 'fetchData': {
      return {
        ...state,
        fetchedAt: new Date()
      };
    }
    default: 
      break;
  }

  return state;
}

const initialState = {
  currentUser: undefined,
  organization: undefined,
  fetchedAt: new Date()
}

const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  let { fetchedAt } = state;
  
  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      user.isAdmin = user.roles.includes("ROLE_ADMIN");
      user.isModerator = user.roles.includes("ROLE_MODERATOR");
      user.isChecker = user.roles.includes("ROLE_CHECKER");

      if (user.organizationId) {
        OrganizationService.getOrganizationById(
          user.organizationId
        ).then(
          response => {
            dispatch({type: 'setUserAndOrganization', user, organization: response});
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
        dispatch({type: 'setUser', user});
      }
    }
  }, [fetchedAt]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppDispatchContext.Provider value={{dispatch}}>
          <AppStateContext.Provider value={{state}}>
            <NavBar />
            <Switch>
              <Route exact path='/' component={Home}></Route> 
              <Route exact path='/login' component={Login}></Route> 
              <Route exact path='/register' component={Register}></Route>
              <Route exact path='/gatherings' component={Gatherings}></Route>
              <Route exact path='/activeGatherings' component={ActiveGatherings}></Route>
              <Route exact path='/checkers' component={Checkers}></Route>
              <Route path='/gatherings/gathering_id' component={Gathering}></Route>
              <Route path='/signup/gathering/:id' component={GatheringSignUp}></Route>
              <Route path='/signup/cycle/:id' 
                render={(props) => (
                  <CycleSignUp {...props} />
                )}
              />
            </Switch> 
          </AppStateContext.Provider>
        </AppDispatchContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
