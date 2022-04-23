import { get, post } from './request.js'

export const postLogin = data => post("/api/login", data)

export const fetchData = data => get("./table.json", data)

export const postPubAnnouncement = data => post("/api/annocement/creat", data)

export const getAnnouncement = data => get("/api/annocement/get", data)

export const postCreatPark = data => post("/api/park/creat",data)