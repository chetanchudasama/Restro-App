import { AxiosResponse } from 'axios';
import axiosAPI from '@/api/AxiosPlugin';
import MenuModel from '@/models/MenuModel';

export default class MenusController {
    // get menu items details
    public static async getMenus(restaurantName: string, lang: string): Promise<any> {
        const res: AxiosResponse = await axiosAPI.get<MenuModel>("menus/" + restaurantName + lang);
        return res;
    }
}
