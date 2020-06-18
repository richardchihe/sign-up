import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_MY_API_URL +'/attendee/';

class AttendeeService {
  signUp(gatheringId, cycleId, name, contact) {
    return axios
      .post(API_URL + "signUp", {
        gatheringId,
        cycleId,
        name,
        contact
      })
      .then(response => {
        return response.data;
      });
  }
}

export default new AttendeeService();