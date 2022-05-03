import { get, post } from './request.js'

export const postLogin = data => post("/api/login", data)

export const fetchData = data => get("./table.json", data)

export const postPubAnnouncement = data => post("/api/annocement/creat", data)

export const getAnnouncement = data => get("/api/annocement/get", data)

export const postCreatPark = data => post("/api/park/creat", data)

export const getParkList = data => get("/api/park/get", data)

export const getOrderList = data => get("/api/order/get", data)

export const postEnterPark = data => post("/api/park/enter", data)

export const postReservePark = data => post("/api/park/reserve", data)

export const postPayPark = data => post("/api/order/pay", data)

export const postLeavePark = data => post("/api/park/leave", data)