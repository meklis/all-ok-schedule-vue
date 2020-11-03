import axios from 'axios'

export async function GetToken (url) {
    var token  = '';
    await axios.get(url).then( e => {
            token = e;
    })
    return  token;
}
export  function GetConfig () {
    return axios.get('config.json')
}
