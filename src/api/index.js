import axios from 'axios';
import {token} from '../actions/signin.actions'

const url = 'http://localhost:3001'
// const url = 'https://biketrailshg-mvp1.herokuapp.com'

const http = axios.create({
    baseURL: url,
    headers: {
        "Content-type":"application/json;charset=UTF-8"
    },
})

http.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')){
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }
    console.log(req)
    return req
})

const getBikeTrails = () => axios.get(`${url}/biketrails`)
const getBikeTrail = id => http.get(`/biketrails/${id}`)
const createBikeTrail = data => http.post(`/biketrails`,data)
const updateBikeTrail = (id,data) => http.put(`/biketrails/${id}`,data)
const deleteBikeTrail = id => http.delete(`/biketrails/${id}`)

const getImages = (id) => http.get(`/biketrails/${id}/images`)
const createImage = (id,data) => http.post(`/biketrails/${id}/images`,data)
const deleteImage = (id,imageId) => http.delete(`/biketrails/${id}/images/${imageId}`)

const createComment = (id,data) => http.post(`/biketrails/${id}/comments`,data)
const deleteComment = (id,commentId) => http.delete(`/biketrails/${id}/comments/${commentId}`)
const updateComment = (id,commentId,data) => http.put(`/biketrails/${id}/comments/${commentId}`,data)

// const register = (registerData) => http.post('/register',registerData)
// const login = (loginData) => http.post('/login',loginData)
// const logout = () => http.get('/logout')


export {
    getBikeTrail,
    getBikeTrails,
    createBikeTrail,
    updateBikeTrail,
    deleteBikeTrail,
    getImages,
    createImage,
    deleteImage,
    createComment,
    updateComment,
    deleteComment,
    // register,
    // login,
    // logout
};