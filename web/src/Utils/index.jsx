export const checkEmailValid = (email) => {
  var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
  if (!filter.test(email)) {
    return false;
  }
  return true;
};

export const checkPhoneValid = (phone) =>{
  var filter = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  if(!filter.test(phone)){
    return false
  }return true
}

export const checkPassword = (password) =>{
  var filter = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[^\W_]{6,}$/;
  if(!filter.test(password)){
    return false
  }return true
}

export const getUserStorage = () =>{
  return JSON.parse(localStorage.getItem('user'))
}
export const setUserStorage = (user) =>{
  localStorage.setItem("user", JSON.stringify(user))
}