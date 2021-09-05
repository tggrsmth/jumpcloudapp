import React, {Component} from 'react'
import './App.css';
import axios from "axios";

class App extends Component{
 
  constructor(props){
    super(props);
    this.state = {id: '', username: '', email: '', allData: ''};
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.refreshPage =this.refreshPage.bind(this);
  }

  handleAdd = event => {
    event.preventDefault();
    const user =  {
      username: this.state.username,
      email: this.state.email
    }
    axios.post(`http://localhost:8005/api/systemusers`, user)
    .then(res=>{
      console.log(res.data)})
    .catch(error => {
      console.error('There was an error', error);
    })
  }

  handleDelete = (e) => {
    e.preventDefault();
    const user =  {
      id: this.state.id,
    }
    console.log(`${user.id}`);
    axios.delete(`http://localhost:8005/api/systemusers/${user.id}`)
    .then(res=>{
      console.log(res.data)})
    .catch(error => {
        console.error('There was an error', error);
      })
  }

  handleUpdate = event => {
    event.preventDefault();
    const user =  {
      id: this.state.id,
      username: this.state.username,
      email: this.state.email
    }
    axios.put(`http://localhost:8005/api/systemusers/${user.id}`, user)
    .then(res=>{
      console.log(res.data)})
    .catch(error => {
      console.error('There was an error', error);
    })
  }


  handleChange = event =>{
    this.setState({[event.target.name]:event.target.value});
  }
  
  componentDidMount(){
   
    axios.get(`http://localhost:8005/api/systemusers`)
    .then(res=> {
      var loopData='';
      for(let i=0;i<res.data.results.length;i++){
          loopData += `${res.data.results[i].id}, ${res.data.results[i].username}, ${res.data.results[i].email}\n`
      }
      this.setState({allData:loopData});
    },
     error => {
      this.setState({
        error
      });
     }
    );
  }

  refreshPage() {
      window.location.reload(false);
  }

  render(){
    const {user,allData} = this.state;
  return (
    <div>
     <h2>CRUD APP for jumpcloud</h2>
     <br></br>
     <br></br>
         <div className="container">
         <form>
      
          <tbody>
                  <tr>
                     <label for="id">id:  </label>
                     <input type="text" placeholder="id" id="id" name="id" onChange={this.handleChange}></input>
                     <label for="username"> Username:  </label>
                     <input type="text" placeholder="Username" id="username" name="username" onChange={this.handleChange}></input>
                     <label for="username"> Email:  </label>
                     <input type="text" placeholder="Email" id="email" name="email" onChange={this.handleChange}></input>
                  </tr>    
                  <br></br>
                   <tr>
                     <button onClick={this.handleUpdate}>Update</button>
                     <button onClick={this.handleDelete}>Delete</button>
                     <button onClick={this.handleAdd}>Add</button>                              
                  </tr>
                  <br></br>
                  <h7>key:  *Update - existing User id, Username and Email required  *Delete - only existing User id required  *Add - Username and Email required </h7>
                  <br></br>
                  <br></br>
                  <br></br>
                  <button onClick={this.refreshPage}>Refresh Users</button> 
                  <h4>List of Users</h4>
                  <h5>id, Username, Email</h5>
                  <div className='new-line'>{allData}</div>
                      
           </tbody> 
          </form> 
         </div> 
    </div>
  );
}
}

export default App;

