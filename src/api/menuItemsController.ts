import { AxiosResponse } from 'axios';
import axiosAPI from '@/api/AxiosPlugin';

export default class MenuItemsController {
    // get menu items details
    public static async getMenuItems(): Promise<any> {
        const res: AxiosResponse = await axiosAPI.get<any>("menuItems");
        return res;
    }
}
