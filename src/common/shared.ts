export default class Shared {
    public static APIBaseURL: string = 'http://test.6lb.menu/api/';

    public static getImageSrcLink(menuItemId: number, menuHasBigPicture: boolean, isRequiredSmallPicture: boolean = true): string {
        return (this.APIBaseURL + "menuItems/" + menuItemId + "/" + (isRequiredSmallPicture ? "smallpicture" : (menuHasBigPicture ? "BigPicture" : "smallpicture")));
    }
}
