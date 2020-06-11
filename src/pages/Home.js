import React, { useEffect } from 'react'; 
import OrganizationForm from '../components/forms/OrganizationForm'
  
const Home = () => { 
  useEffect(() => {
    document.title = "A Web Dev"
  }, []);

  return (
    <>
      <OrganizationForm />
    </>
  )
}
  
export default Home;