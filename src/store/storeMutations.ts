import { MutationTree } from 'vuex';
import store, { State } from '@/store';
import MenuModel from '@/models/MenuModel';

export const mutationTree: MutationTree<State> = {
    setMenusEN: (s: State, r: MenuModel | null) => { s.menusEN = r; },
    setMenusAR: (s: State, r: MenuModel | null) => { s.menusAR = r; },
    setMenuItems: (s: State, r: any) => { s.menuItems = r; },
};

class StoreMutations {
    public setMenusEN(menusEN: MenuModel | null) {
        store.Instance.commit('setMenusEN', menusEN);
    }
    public setMenusAR(menuItemAR: MenuModel | null) {
        store.Instance.commit('setMenusAR', menuItemAR);
    }
    public setMenuItems(menuItems: any) {
        store.Instance.commit('setMenuItems', menuItems);
    }
}

export default new StoreMutations();
