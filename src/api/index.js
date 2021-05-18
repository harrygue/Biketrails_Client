import axios from 'axios';

// const url = 'http://localhost:3001'
const url = 'https://biketrailshg-mvp1.herokuapp.com'

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
    console.log('app/index')
    return req
})

const getBikeTrails = () => axios.get(`${url}/biketrails`)
const getBikeTrail = id => http.get(`/biketrails/${id}`)
const createBikeTrail = data => http.post(`/biketrails`,data)
const updateBikeTrail = (id,data) => http.put(`/biketrails/${id}`,data)
const deleteBikeTrail = id => http.delete(`/biketrails/${id}`)
const updateBTlikes = (id,likesData) => http.put(`/biketrails/${id}/updateLikes`,likesData)

const getImages = (id) => http.get(`/biketrails/${id}/images`)
const createImage = (id,data) => http.post(`/biketrails/${id}/images`,data)
const deleteImage = (id,imageId) => http.delete(`/biketrails/${id}/images/${imageId}`)

const createComment = (id,data) => http.post(`/biketrails/${id}/comments`,data)
const deleteComment = (id,commentId) => http.delete(`/biketrails/${id}/comments/${commentId}`)
const updateComment = (id,commentId,data) => http.put(`/biketrails/${id}/comments/${commentId}`,data)
const updateCommentLikes = (id,commentId,likesData) => http.put(`/biketrails/${id}/comments/${commentId}/updateLikes`,likesData)

export {
    getBikeTrail,
    getBikeTrails,
    createBikeTrail,
    updateBikeTrail,
    deleteBikeTrail,
    updateBTlikes,
    getImages,
    createImage,
    deleteImage,
    createComment,
    updateComment,
    deleteComment,
    updateCommentLikes
};