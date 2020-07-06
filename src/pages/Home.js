import React, { useEffect } from 'react'; 
import Typography from '@material-ui/core/Typography';
  
const Home = () => { 
  useEffect(() => {
    document.title = "Gatherings"
  }, []);

  return (
    <>
      <Typography variant="h1" align="center" >
        A Gatherings Sign Up App
      </Typography>
    </>
  )
}
  
export default Home;