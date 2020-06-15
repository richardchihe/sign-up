import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_MY_API_URL +'/cycle/';

class CycleService {
  createCycle(organizationId, title) {
    return axios
      .post(API_URL + "new", {
        organizationId,
        title
      }, { headers: authHeader() })
      .then(response => {
        return response.data;
      });
  }

  getCyclesAndGatherings(filter) {
    console.log(filter);
    var request = {
      headers: authHeader(),
      params : {
        filter
      }
    };

    return axios.get(API_URL + "cAndG", request).then(response => {
      return response.data;
    });;
  }

  toggleArchiveStatus(id) {
    return axios
      .put(API_URL + "toggleArchiveStatus", {
        id
      }, { headers: authHeader() })
      .then(response => {
        return response.data;
      });;
  }

  updateOrganization(title) {
    return axios
      .put(API_URL + "update", {
        title
      }, { headers: authHeader() });
  }
}

export default new CycleService();