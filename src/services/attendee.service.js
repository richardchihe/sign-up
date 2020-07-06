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

  async getAttendees(gatheringId) {
    const response = await axios.get(API_URL + "attendees/" + gatheringId);
    return response.data;
  }

  async toggleAttendedStatus(id, hasAttended, checker) {
    const response = await axios
      .put(API_URL + "toggleAttendedStatus", {
        id,
        hasAttended,
        checker
      }, { headers: authHeader() });
    return response.data;
  }
}

export default new AttendeeService();