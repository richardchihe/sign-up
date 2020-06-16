import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_MY_API_URL +'/gathering/';

class GatheringService {
  async createGathering(
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
    const response = await axios
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
      }, { headers: authHeader() });
    return response.data;
  }

  getGathering(id) {
    return axios.get(API_URL + id);
  }

  async toggleOpenStatus(id) {
    const response = await axios
      .put(API_URL + "toggleOpenStatus", {
        id
      }, { headers: authHeader() });
    return response.data;
  }

  async toggleArchiveStatus(id) {
    const response = await axios
      .put(API_URL + "toggleArchiveStatus", {
        id
      }, { headers: authHeader() });
    return response.data;
  }

  async updateGathering(id, title, date, from, to, seatingCapacity, description, requireContact) {
    from = new Date(date + ' ' + from);
    to = new Date(date + ' ' + to);
    date = new Date(date);
    description = description.split(',');
    const response = await axios
      .put(API_URL + "update", {
        id,
        title,
        date,
        from,
        to,
        seatingCapacity,
        description,
        requireContact
      }, { headers: authHeader() });
    return response.data;
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