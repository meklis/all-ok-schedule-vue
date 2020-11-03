import axios from 'axios'


Array.prototype.removeValue = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


export default class ServerApi {
    /**
     * @type AxiosInstance
     */
    _http = null
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
    getCalendarTypes(callback) {
        this._inProccessMethods.push('calendar_types');
        let promise = this._http.get('/v2/private/employees/schedule_types') .then(resp => {
            callback(resp.data.data)
            this._inProccessMethods.removeValue('calendar_types');
            return resp
        }).finally(() => {
            this._inProccessMethods.removeValue('calendar_types');
        });

        if(this._waitEnabled) {
            this._promises.push(promise);
        }
        return promise;
    }

    getGroups(callback) {
        this._inProccessMethods.push('groups');
        let promise = this._http.get('/v2/private/employees/schedule_groups') .then(resp => {
            callback(resp.data.data)
            this._inProccessMethods.removeValue('groups');
            return resp
        }).finally(() => {
            this._inProccessMethods.removeValue('groups');
        });

        if(this._waitEnabled) {
            this._promises.push(promise);
        }
        return promise;
    }

    getEmployees(callback) {
        this._inProccessMethods.push('employees');
        let promise = this._http.get('/v2/private/employees/responsible_list') .then(resp => {
            callback(resp.data.data)
            this._inProccessMethods.removeValue('employees');
            return resp
        }).finally(() => {
            this._inProccessMethods.removeValue('employees');
        });

        if(this._waitEnabled) {
            this._promises.push(promise);
        }
        return promise;
    }

    getSchedules(callback, start, end) {
        this._inProccessMethods.push('schedules');
        let promise = this._http.get('/v2/private/employees/schedule', {
            params: {
              start: start + " 00:00:00",
              end: end + " 23:59:59",
            },
        }) .then(resp => {
            callback(resp.data.data)
            this._inProccessMethods.removeValue('schedules');
            return resp
        }).finally(() => {
            this._inProccessMethods.removeValue('schedules');
        });

        if(this._waitEnabled) {
            this._promises.push(promise);
        }
        return promise;
    }

    deleteSchedule(id) {
        this._inProccessMethods.push('delete');
        let promise = this._http.delete('/v2/private/employees/schedule/' + id , {
        }) .then(resp => {
            this._inProccessMethods.removeValue('delete');
            return resp
        }).finally(() => {
            this._inProccessMethods.removeValue('delete');
        });

        if(this._waitEnabled) {
            this._promises.push(promise);
        }
        return promise;
    }

    createSchedule(data) {
        this._inProccessMethods.push('createSchedule');
        let promise = this._http.post('/v2/private/employees/schedule', data) .then(resp => {
            this._inProccessMethods.removeValue('createSchedule');
            return resp
        }).finally((f ) => {
            this._inProccessMethods.removeValue('createSchedule');
            return f
        });

        if(this._waitEnabled) {
            this._promises.push(promise);
        }
        return promise;
    }
    updateSchedule(id, data) {
        this._inProccessMethods.push('updateSchedule');
        let promise = this._http.put('/v2/private/employees/schedule/'+id, data) .then(resp => {
            this._inProccessMethods.removeValue('updateSchedule');
            return resp
        }).finally((f) => {
            this._inProccessMethods.removeValue('updateSchedule');
            return f
        });

        if(this._waitEnabled) {
            this._promises.push(promise);
        }
        return promise;
    }

    getSchedule(callback, id) {
        this._inProccessMethods.push('schedule');
        let promise = this._http.get('/v2/private/employees/schedule/' + id , {
        }) .then(resp => {
            callback(resp.data)
            this._inProccessMethods.removeValue('schedule');
            return resp
        }).finally(() => {
            this._inProccessMethods.removeValue('schedule');
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
            this._inProccessMethods.removeValue(actionName);
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
}