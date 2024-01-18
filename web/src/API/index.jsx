import axios from 'axios'

var api = axios.create({
    baseURL:'http://localhost:3000/api'
})

export const postApiNoneToken=(url,data)=>{
    return api.post(url,data)
}
export const getAPiNoneToken=(url,data)=>{
    return api.get(url,data)
}