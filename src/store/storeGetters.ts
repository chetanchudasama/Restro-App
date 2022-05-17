import { GetterTree } from 'vuex';
import store, { State } from './index';
import MenuModel from '@/models/MenuModel';

export const getterTree: GetterTree<State, State> = {
    getMenusEN: (state) => () => {
        if (store.Instance.state.menusEN) {
            return store.Instance.state.menusEN;
        }
        return [];
    },
    getMenusAR: (state) => () => {
        if (store.Instance.state.menusAR) {
            return store.Instance.state.menusAR;
        }
        return [];
    },
    getMenuItems: (state) => () => {
        if (store.Instance.state.menuItems) {
            return store.Instance.state.menuItems;
        }
        return [];
    },
};

class StoreGetters {
    public getMenusEN(): MenuModel | null {
        return store.Instance.getters.getMenusEN();
    }

    public getMenusAR(): MenuModel | null {
        return store.Instance.getters.getMenusAR();
    }

    public getMenuItems(): any {
        return store.Instance.getters.getMenuItems();
    }
}

export default new StoreGetters();
