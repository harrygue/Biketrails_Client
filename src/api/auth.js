import axios from 'axios';

const url = 'http://localhost:3001'
// const url = 'https://biketrailshg-mvp1.herokuapp.com'

const http = axios.create({
    baseURL: url,
    headers: {
        "Content-type":"application/json;charset=UTF-8"
    },
})

const register = (registerData) => http.post('/register',registerData)
const login = (loginData) => http.post('/login',loginData)
const logout = () => http.get('/logout')


export {
    register,
    login,
    logout
};