  <template>
  <div id="app">
    <v-app id="inspire">
      <v-main>
        <v-container fluid fill-height class="pa-0">
          <v-layout>
            <v-flex xs12>
              <Dashboard :isLoadingApp.sync="isLoadingApp"></Dashboard>
              <v-fade-transition mode="out-in" v-bar>
                <router-view v-if="!isLoadingApp" :key="$route.fullPath" />
              </v-fade-transition>
            </v-flex>
          </v-layout>
        </v-container>
       <v-snackbar 
          :timeout="snackbarTimeout"
          v-model="snackbar"
          left
          bottom
          class="snack-bar"
          outlined
        >
          <i class="icon-wrap">
            <img src="/img/caution.svg" alt="caution icon" />
          </i>
          {{ snackbarText }}
        </v-snackbar>
      </v-main>
    </v-app>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 767px;
  margin: 0 auto;
  overflow-y: auto;
  height: 100vh;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Shared from "./common/shared";
import Dashboard from "@/components/Dashboard.vue";
import eventBus from '@/common/bus';

@Component({
  components: { Dashboard },
})
export default class App extends Vue {
  public Vuebar = require("vuebar");
  private snackbarTimeout: number = 5000;
  private snackbar: boolean = false;
  private snackbarText: string = "";
  private isLoadingApp: boolean = true;

  private created() {
    Vue.use(this.Vuebar);
  }

  private mounted() {
    eventBus.$on("showMessage", (message: string) => {
      this.snackbar = true;
      this.snackbarText = message;
    });
  }
}
</script>
