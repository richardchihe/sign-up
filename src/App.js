import React, { useReducer, useEffect } from 'react';
import './App.scss';
import { 
	BrowserRouter as Router, 
	Route, 
	Switch 
} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import theme from './theme';
import NavBar from './components/navigation/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Gatherings from './pages/Gatherings';
import Gathering from './pages/Gathering';
import Pricing from './components/Pricing';

import { AppStateContext, AppDispatchContext } from './contexts/app.context';
import AuthService from "./services/auth.service";

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
  }

  return state;
}

const initialState = {
  currentUser: undefined,
  organization: undefined
}

const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      dispatch({type: 'setUser', user})
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppDispatchContext.Provider value={{dispatch}}>
          <AppStateContext.Provider value={{state}}>
            <NavBar />
            <Container style={{marginTop: '2em'}}>
              <Switch>
                <Route exact path='/' component={Home}></Route> 
                <Route exact path='/login' component={Login}></Route> 
                <Route exact path='/register' component={Register}></Route>
                <Route exact path='/gatherings/gathering' component={Gathering}></Route>
                <Route exact path='/gatherings' component={Gatherings}></Route>
                <Route exact path='/pricing' component={Pricing}></Route> 
              </Switch> 
            </Container>
          </AppStateContext.Provider>
        </AppDispatchContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
