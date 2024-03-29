import axios from 'axios'

export const getRegisters = (state) => {
 axios.get(`${process.env.API}/api/registers`)
  .then((response) => {
    state.registers = response.data;
  })
  .catch((error) => {
    console.log(error);
  });
}

export const getUsers = (state) => {
  axios.get(`${process.env.API}/api/users`)
   .then((response) => {
     
     state.users = response.data;
   })
   .catch((error) => {
     console.log(error);
   });
 }

 export const getUsersDetails = (state) => {
  axios.get(`${process.env.API}/api/usersDetails`)
   .then((response) => {
     
     state.usersDetails = response.data;
   })
   .catch((error) => {
     console.log(error);
   });
 }

export const pendingPerson = (state,payload) =>{
  state.person = payload;
  /*state.person = state.registers.filter(el=>{
   return el.name == payload;
  });*/
}

export const personRegistersPending = (state,payload) =>{
  state.personRegistersPending = payload;
  /*state.person = state.registers.filter(el=>{
   return el.name == payload;
  });*/
}