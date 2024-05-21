import axios from 'axios';
export default axios.create({
    baseURL: `${process.env.REACT_APP_ED_DATA_WEB_API}`
})
