export const checkEmailValid = (email) => {
  var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
  if (!filter.test(email)) {
    return false;
  }
  return true;
};

export const getUserStorage = () =>{
  return JSON.parse(localStorage.getItem('user'))
}
export const setUserStorage = (user) =>{
  localStorage.setItem("user", JSON.stringify(user))
}