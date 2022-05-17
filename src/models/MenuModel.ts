import MenuCategoryModel from './MenuCategoryModel';

export default class MenuModel {
    public title: string;
    public address: string;
    public addressCoordinates: string;
    public timingMessage: string;
    public isActive: boolean;
    public urlId: string;
    public offerDelivery: boolean;
    public offerPickup: boolean;
    public status: any;
    public whatsappNumber: number;
    public categories: MenuCategoryModel[];

    constructor() {
        this.categories = [];
    }
}
