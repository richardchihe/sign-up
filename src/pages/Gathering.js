import React, { useEffect } from 'react'; 
import AttendeesTable from '../components/tables/AttendeesTable'
  
const Gathering = () => { 
  useEffect(() => {
    document.title = "A Web Dev"
  }, []);

  return (
    <>
      Gathering Details
      <AttendeesTable />
    </>
  )
}
  
export default Gathering;