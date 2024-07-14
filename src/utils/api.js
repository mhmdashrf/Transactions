import axios from "axios";

const BASE_URL ="https://api.jsonbin.io/v3/b";
const API_KEY = "/6691cd1dacd3cb34a86554e1 "
  const NAME_HEADERS ="X-MASTER-KEY"
const TMDB_TOKEN="$2a$10$P3vAD9DTjAI2ETzQsJ6BjecSRTvvScPKU1ZvJ07PErq0len7ICadu";
const headers={
   [ NAME_HEADERS] : TMDB_TOKEN,
}
export const fetchDataFromApi = async ()=>{
try{
const {data} = await axios.get(BASE_URL + API_KEY,{
    headers,
    
})
return data; 
}catch(err){
    console.log(err);
    return err
}
}