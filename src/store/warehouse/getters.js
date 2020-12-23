export const filterById = state => payload => {
  return state.registers.filter(data => {
    return data.id == payload;
  });
};
export const filterByCategory = state => payload => {
  return state.registers.filter(data => {
    if (data.category == payload[0] || data.category == payload[1]) {
      return true;
    }
  });
};

export const filterByName = state => {
  return state.users.map(data => {
    return {
      id: data.id,
      name: data.name
    };
  });
};

export const UserById = state => payload => {
  
  return state.users.filter(data => {
    return data.id == payload;
  });
};

export const UserByName = state => payload => {
  
  return state.users.filter(data => {
    return data.name == payload;
  });
};
