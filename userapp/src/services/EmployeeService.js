import axios from 'axios';
const BASE_URL = "http://localhost:8005/api/systemusers";

class EmployeeService {
    
    getEmployees(){
	    return axios.get(BASE_URL);
    }

    getEmployeeById(id){
	    return axios.get(BASE_URL + "/" + id);
    }

    createEmployee(employee){
	    return axios.post(BASE_URL, employee);
    }

    updateEmployee(employee, id){
	    return axios.put(BASE_URL + '/' + id, employee);
    }

    deleteEmployee(id){
	    return axios.delete(BASE_URL + '/' + id);
    }
}

export default new EmployeeService();

