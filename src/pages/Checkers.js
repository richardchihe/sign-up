import React, { useEffect } from 'react'; 
  
const Checkers = () => { 
  useEffect(() => {
    document.title = "A Web Dev"
  }, []);

  return (
    <>
      Checkers
    </>
  )
}
  
export default Checkers;