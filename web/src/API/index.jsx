import axios from 'axios'

var api = axios.create({
    baseURL:'http://localhost:3000/api'
})

export const postApiNoneToken=(data)=>{
    return api.post("/auth/register",{data})
}