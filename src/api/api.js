import { get, post } from './request.js'

export const postLogin = data => post("/api/login", data)

export const postRegister = data => post("/api/register", data)

export const getFrontPage = data => get("/api/frontPage", data)

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

export const postUploadMessage = data => post("/api/checkmessage/creat", data)

export const postRecharge = data => post("/api/order/recharge", data)

export const getMyPark = data => get("/api/park/getself", data)

export const delPark = data => post("/api/park/delete", data)

export const getUser = data => get("/api/user/get",data)

export const delUser = data => post("/api/user/del", data)

export const updateUser = data => post("/api/user/update", data)
