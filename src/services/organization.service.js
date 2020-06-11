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
      }, { headers: authHeader() });
  }

  getOrganization(slug) {
    return axios.get(API_URL + slug);
  }

  updateOrganization(id, title, description, markdown) {
    return axios
      .put(API_URL + "update", {
        id,
        title,
        description,
        markdown
      }, { headers: authHeader() });
  }
}

export default new OrganizationService();