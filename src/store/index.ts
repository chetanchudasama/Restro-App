import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { ActionTree } from 'vuex';
import { mutationTree as mutations } from './storeMutations';
import { getterTree as getters } from './storeGetters';
import MenuModel from '@/models/MenuModel';

// tslint:disable:no-console
Vue.use(Vuex);

// interface that models the vuex state for the application
export interface State {
  menusEN: MenuModel | null;
  menusAR: MenuModel | null;
  menuItems: any;
}

const actions: ActionTree<State, any> = {
};

class StoreWrapper {

  public static get Instance(): Store<State> {
    if (StoreWrapper.store) {
      return StoreWrapper.store;
    } else {
      return new Store<State>({});
    }
  }

  public static LoadStore(): Store<State> {
    const state: State = {
      menusEN: new MenuModel(),
      menusAR: new MenuModel(),
      menuItems: [],
    };

    StoreWrapper.store = new Vuex.Store<State>({
      state,
      mutations,
      actions,
      getters,
    });
    return StoreWrapper.Instance;
  }

  private static store: Store<State>;
}

export default StoreWrapper;
