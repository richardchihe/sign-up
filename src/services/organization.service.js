import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_MY_API_URL +'/organization/';

class OrganizationService {
  createOrganization(name, seatingCapacity, address, contact) {
    return axios
      .post(API_URL + "new", {
        name,
        seatingCapacity,
        address,
        contact
      }, { headers: authHeader() })
      .then(response => {
        if (response.data.user.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        return response.data;
      });
  }

  async getOrganizationById(id) {
    const response = await axios.get(API_URL + "id/" + id);
    return response.data;
  }

  getOrganization(slug) {
    return axios.get(API_URL + slug);
  }

  updateOrganization(name, seatingCapacity, address, contact) {
    return axios
      .put(API_URL + "update", {
        name,
        seatingCapacity,
        address,
        contact
      }, { headers: authHeader() });
  }
}

export default new OrganizationService();