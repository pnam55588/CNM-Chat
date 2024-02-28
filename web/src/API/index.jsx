import axios from 'axios'
import { getUserStorage } from '../Utils'

var api = axios.create({
    baseURL:'http://localhost:3000/api'
})

export const postApiNoneToken=(url,data)=>{
    return api.post(url,data)
}
export const getAPiNoneToken=(url,data)=>{
    return api.get(url,data)
}
export const getApiWithToken=(url)=>{
    const token = getUserStorage().token
    return api.get(url, {
        headers: {
            "auth-token":`${token}`
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer ${token} `,
        },
      });
}
export const postApiWithToken=(url,data)=>{
    const token = getUserStorage().token
    return api.post(url,data, {
        headers: {
            "auth-token":`${token}`
        },
      });
}

export const putApiWithToken=(url,data)=>{
    const token = getUserStorage().token
    return api.put(url,data, {
        headers: {
            "auth-token":`${token}`
        },
      });
}
export const deleteApiWithToken=(url,data)=>{
    const token = getUserStorage().token
    return api.delete(url,data, {
        headers: {
            "auth-token":`${token}`
        },
      });
}