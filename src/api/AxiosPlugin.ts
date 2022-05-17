import _Vue from 'vue';
import Axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import Shared from '@/common/shared';

export function getBaseUrl(): string {
    return Shared.APIBaseURL;
}

function generateAxiosInstance(): AxiosInstance {
    const axios = Axios.create({
        transformResponse: (data: any): any => {
            let res: any = data;
            try {
                if (typeof data !== 'string') {
                    // data is not string, cant pass it, return as is now.
                    return data;
                }
            } catch (ex) {
                try {
                    // custom parse failed, just use default parse
                    res = JSON.parse(data);
                } catch (iex) {
                    // default parse also failed, return data as was
                    res = data;
                }
            }
            return res;
        },
        validateStatus: (status: number) => (status >= 200 && status < 300) || [404, 400, 409].indexOf(status) > -1,
    });

    axios.interceptors.request.use((config: AxiosRequestConfig) => {
        // Un-comment below line to get token based data
        // if (!config.headers.Authorization) {
        //     config.headers.Authorization = 'bearer ' + "token";
        // }

        // api base url
        config.baseURL = getBaseUrl();
        return config;
    });

    return axios;
}

const axiosInstance = generateAxiosInstance();
export default axiosInstance;
