import React, { useEffect } from 'react'; 
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'; 
  
const Home = () => { 
  useEffect(() => {
    document.title = "Gatherings"
  }, []);

  return (
    <Container style={{marginTop: '1em'}}>
      <Typography variant="h2" align="center" >
        A Gatherings Sign Up App
      </Typography>
      <Container style={{marginTop: '1em', display: 'flex', flexDirection: 'column'}}>
        <Link style={{margin: 'auto'}} to="/login">
          <Button 
            style={{width: '150px'}}
            variant="outlined"
            color="primary"
          >
            Login
          </Button>
        </Link>
        <Typography align="center">
          or
        </Typography>
        <Link style={{margin: 'auto'}} to="/register">
          <Button 
            style={{width: '150px'}}
            variant="outlined"
            color="secondary"
          >
            Create an account
          </Button>
        </Link>
      </Container>
    </Container>
  )
}
  
export default Home;