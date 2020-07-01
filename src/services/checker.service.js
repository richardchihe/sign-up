import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_MY_API_URL +'/checker/';

class CheckerService {
  async registerChecker(
    organizationId,
    username,
    password
  ) {
    const response = await axios
      .post(API_URL + "new", {
        organizationId,
        username,
        password,
        roles: ['user', 'checker']
      }, { headers: authHeader() });
    return response.data;
  }

  async getCheckers (
    organizationId
  ) {
    var request = {
      headers: authHeader(),
      params : {
        organizationId
      }
    };

    return axios.get(API_URL + "getCheckers/", request).then(response => {
      return response.data;
    });
  }

  async toggleDeletedStatus(id) {
    const response = await axios
      .put(API_URL + "toggleDeletedStatus", {
        id
      }, { headers: authHeader() });
    return response.data;
  }

  async setPassword(id, password) {
    const response = await axios
      .put(API_URL + "setPassword", {
        id,
        password
      }, { headers: authHeader() });
    return response.data;
  }
}

export default new CheckerService();