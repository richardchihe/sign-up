import React, { useEffect } from 'react'; 
  
const Gathering = () => { 
  useEffect(() => {
    document.title = "Gatherings"
  }, []);

  return (
    <>
      A Gatherings Sign Up App
    </>
  )
}
  
export default Gathering;