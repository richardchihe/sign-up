import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_MY_API_URL +'/gathering/';

class GatheringService {
  createGathering(
    organizationId,
    cycleId,
    title,
    date,
    from,
    to,
    seatingCapacity,
    description,
    requireContact,
  ) {
    from = new Date(date + ' ' + from);
    to = new Date(date + ' ' + to);
    date = new Date(date);
    description = description.split(',');
    !cycleId && (cycleId = null); 
    return axios
      .post(API_URL + "new", {
        organizationId,
        cycleId,
        title,
        date,
        from,
        to,
        seatingCapacity,
        description,
        requireContact
      }, { headers: authHeader() })
      .then(response => {
        return response.data;
      });
  }

  getGathering(id) {
    return axios.get(API_URL + id);
  }

  updateGathering(name, seatingCapacity, address, contact) {
    return axios
      .put(API_URL + "update", {
        name,
        seatingCapacity,
        address,
        contact
      }, { headers: authHeader() });
  }

  deleteGathering(id) {
    return axios
      .delete(API_URL + "delete", {
        headers: authHeader() ,
        data: {
          id
        }
      });
  }
}

export default new GatheringService();