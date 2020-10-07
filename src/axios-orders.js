import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-builder-39862.firebaseio.com/'
});

export default instance;