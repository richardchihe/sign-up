import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_MY_API_URL +'/checker/';

class CheckerService {
  async registerChecker(
    organizationId,
    username,
    password
  ) {
    console.log("Test2");
    const response = await axios
      .post(API_URL + "new", {
        organizationId,
        username,
        password,
        roles: ['user', 'checker']
      }, { headers: authHeader() });
    return response.data;
  }
}

export default new CheckerService();