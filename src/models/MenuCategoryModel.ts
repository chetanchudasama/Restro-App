import MenuItemModel from './MenuItemModel';

export default class MenuCategoryModel {
    public id: number;
    public name: string;
    public items: MenuItemModel[];

    constructor() {
        this.items = [];
    }
}
