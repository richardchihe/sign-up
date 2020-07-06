import React, { useContext, useEffect } from 'react'; 
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'; 
import { useHistory, useLocation } from "react-router";

import { AppStateContext, AppDispatchContext } from '../../contexts/app.context';
import AuthService from "../../services/auth.service";

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}));
  
const NavBar = () => { 
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { state } = useContext(AppStateContext);
  const { dispatch } = useContext(AppDispatchContext);

  const logout = () => {
    AuthService.logout();
    dispatch({type: 'setUser', user: undefined});
    history.push("/");
  }

  useEffect(() => {
    // console.log(location.pathname.split('/')[1])
  }, []);


  return (
    <>
      {(location.pathname.split('/')[1] !== 'signup') && (
        <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
              {state.currentUser ? `Hi ${state.currentUser.username}!` :'Gatherings'}
            </Typography>
            {state.currentUser ? (
              <nav>
                {state.currentUser.isModerator && (
                  <>
                  <Link to="/gatherings">
                    <Typography variant="button" color="textPrimary" className={classes.link}>
                      Gatherings
                    </Typography>
                  </Link>
                  <Link to="/checkers">
                    <Typography variant="button" color="textPrimary" className={classes.link}>
                      Checkers
                    </Typography>
                  </Link>
                  </>
                )}
                <Button
                  color="primary"
                  variant="outlined"
                  className={classes.link}
                  onClick={() => logout()}>
                  Logout
                </Button>
              </nav>
            ) : (
              <Link to="/login">
                <Button color="primary" variant="outlined" className={classes.link}>
                  Login
                </Button>
              </Link>
            )}
          </Toolbar>
        </AppBar>
      )}
    </>
  )
}
  
export default NavBar;