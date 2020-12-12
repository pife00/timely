export const filterById = (state) =>(payload) => {
   //return state.registers
    return state.registers.filter(data=>{
        return data.id == payload
    });
}
export const filterByCategory = (state) =>(payload)=>{
    return state.registers.filter(data=>{
       if(data.category == payload[0] || data.category == payload[1]){
           return true;
       }
    });
}
