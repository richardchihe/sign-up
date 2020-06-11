import React, { useEffect } from 'react'; 
import GatheringContainer from '../components/containers/GatheringContainer'
import Grid from '@material-ui/core/Grid';

const meetings = [
  {
    _id: '1',
    title: '7AM - 9AM',
    subheader: 'Date',
    from: '7:00AM',
    to: '9:00AM',
    mainContent: '70/70',
    description: ['10 users included'],
    buttonText: 'Full',
    buttonVariant: 'outlined',
  },
  {
    _id: '2',
    title: '10AM - 12NN',
    subheader: 'Date',
    from: '10:00AM',
    to: '12:00NN',
    mainContent: '55/70',
    description: [],
    buttonText: 'Sign up',
    buttonVariant: 'contained',
  },
  {
    _id: '3',
    title: '1PM - 2PM',
    subheader: 'Date',
    from: '1:00PM',
    to: '2:00PM',
    mainContent: '70/70',
    description: [
      '50 users included',
      '30 GB of storage'
    ],
    buttonText: 'Full',
    buttonVariant: 'outlined',
  },
];
  
const Gatherings = () => { 
  useEffect(() => {
    document.title = "A Web Dev";

    //Check role then get data
  }, []);

  const handleClick = (data) => {
    console.log(data);
  }

  return (
    <>
      <Grid container spacing={5} alignItems="flex-end">
        {meetings.map((meeting) => (
          <GatheringContainer key={meeting.title} meeting={meeting} click={(data) => {handleClick(data)}}/>
        ))}
      </Grid>
    </>
  )
}
  
export default Gatherings;