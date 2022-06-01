import axios from "axios";
import { useState } from 'react'

const api = axios.create({
 baseURL: "https://api-cardapio-online.onrender.com/",
 //baseURL: "http://192.168.0.40:8680/",
});

export default api;