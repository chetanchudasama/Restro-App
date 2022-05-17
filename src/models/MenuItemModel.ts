import MenuItemOptionCategoryModel from './MenuItemOptionCategoryModel';

export default class MenuItemModel {
    public id: number;
    public name: string;
    public description: string;
    public price: number;
    public categoryId: number;
    public isAvailable: boolean;
    public hasSmallPicture: boolean;
    public hasBigPicture: boolean;
    public optionCategories: MenuItemOptionCategoryModel[];
    public itemQuantity: number;

    constructor() {
        this.itemQuantity = 1;
        this.optionCategories = [];
    }
}
