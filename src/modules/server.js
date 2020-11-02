import axios from 'axios'


export default class ServerApi {
    /**
     * @type AxiosInstance
     */
    _http = null;
    _devIp = "";
    _promises = [];
    _inProccessMethods = [];
    _waitEnabled = false;

    constructor(ApiBaseUrl, token = "") {
        const defaultOptions = {
            baseURL: ApiBaseUrl,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Key': token,
            },
        };
        this._http = axios.create(defaultOptions);
    }
    setToken(token) {
        this._http.interceptors.request.use(function (config) {
            config.headers['X-Auth-Token'] =  token;
            return config;
        });
    }

    /**
     *
     * @returns {Promise<AxiosResponse<T>>}
     */
    getDeviceModules(callback) {
        this._inProccessMethods.push('modules');
        return this._http.get('/private/switcher/modules') .then(resp => {
            callback(resp.data)
            this._inProccessMethods.remove('modules');
            return resp
        }, err => {
            console.log(err)
            this._inProccessMethods.remove('modules');
            return err
        })
    }
    getDeviceStoreInfo(callback) {
        this._inProccessMethods.push('device_store_info');
        let promise =  this._http.get('/private/switcher/device_store_info') .then(resp => {
            callback(resp.data)
            return resp
        }, err => {
            console.log(err)
            return err
        }).finally(() => {
            this._inProccessMethods.remove('device_store_info');
        })
        if(this._waitEnabled) {
            this._promises.push(promise);
        }
        return promise;
    }
    getDeviceInfo(callback) {
        this._inProccessMethods.push('device_info');
        let promise = this._http.get('/private/switcher/device_info') .then(resp => {
            callback(resp.data)
            this._inProccessMethods.remove('device_info');
            return resp
        }).finally(() => {
            this._inProccessMethods.remove('device_info');
        });

        if(this._waitEnabled) {
            this._promises.push(promise);
        }
        return promise;
    }
    /**
     *
     * @returns {Promise<AxiosResponse<T>>}
     */
    getAction(actionName, params = {}, callback = null) {
        this._inProccessMethods.push(actionName);
        let url = '/private/switcher/module/'+actionName+'?1=1'
        for (let k in params) {
            let v = params[k];
            url += '&' + k + '=' + v
        }
        let promise = this._http.get(url) .then(resp => {
            if (callback !== null) {
                callback(resp.data)
            }
            return resp
        }).finally(() => {
            this._inProccessMethods.remove(actionName);
        }).catch(e => {
            console.log("Catching error from getAction")
            console.log(e)
        });
        if(this._waitEnabled) {
            this._promises.push(promise);
        }
        return promise;
    }

    /**
     *
     * @returns {ServerApi}
     */
    enableWaiting() {
        this._waitEnabled = true;
        this._promises = [];
        return this;
    }

    /**
     *
     * @returns {ServerApi}
     */
    disableWaiting() {
        this._waitEnabled = false;
        this._promises = [];
        return this;
    }

    /**
     *
     * @returns {Promise<unknown[]>}
     */
    async waitResponses() {
        let resp = await axios.all(this._promises);
        this._promises = [];
        return resp;
    }
    getInProccessMethods() {
        return this._inProccessMethods;
    }

    setDevIp(ip) {
        this._http.defaults.headers.common['X-Device-Ip'] = ip;
        return this;
    }

}