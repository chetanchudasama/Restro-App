import MenuItemOptionModel from './MenuItemOptionModel';

export default class MenuItemOptionCategoryModel {
    public id: number;
    public name: string;
    public checkType: string;
    public itemId: number;
    public options: MenuItemOptionModel[];

    constructor() {
        this.options = [];
    }
}
