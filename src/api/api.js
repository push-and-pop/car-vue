import { get, post } from './request.js'

export const postLogin = data => post("/api/login", data)