import axios from "axios";


export const api = axios.create({
baseURL: "http://18.191.178.183:8080/api", 
});