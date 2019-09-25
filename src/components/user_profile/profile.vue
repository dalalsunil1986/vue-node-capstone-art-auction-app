<template>
  <div>
    <v-card flat class="p-3">
      <b-row>
        <b-col lg="12" class="text-center">
          <div style="width: 100%;">
            <img :src="user.picture" style="width: 100%; height: 100%; cursor: unset" alt="avatar" />
          </div>
        </b-col>

        <b-col lg="12" class="mt-3">
          <span class="float-right mt-1" style="cursor: pointer" @click="settings = !settings">
            <i class="material-icons" style="font-size: 17px; opacity: 0.7">settings</i>
          </span>

          <h1 class="mb-0">{{ user.username }}</h1>
          <ratingComponent class="p-0" :rating="user.rating"></ratingComponent>

          <p class="mt-1" style="opacity: 0.8">{{ user.description }}</p>

          <v-divider></v-divider>

          <b-row>
            <b-col>
              <div class="text-center hoverDiv" @click="emitProfileStatus('active')">
                <h2 class="mb-0" style="font-size: 17px">{{ activeAuctions.length }}</h2>
                <span class="smallText" style="opacity: 0.7; font-size: 12px">Listings</span>
              </div>
            </b-col>
            <b-col>
              <div class="text-center hoverDiv" @click="emitProfileStatus('sales')">
                <h2 class="mb-0" style="font-size: 17px">{{sales.length}}</h2>
                <span style="opacity: 0.7; font-size: 12px">Sales</span>
              </div>
            </b-col>
            <b-col>
              <div class="text-center hoverDiv" @click="emitProfileStatus('reviews')">
                <h2 class="mb-0" style="font-size: 17px">{{reviews.length}}</h2>
                <span style="opacity: 0.7; font-size: 12px">Reviews</span>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </v-card>

    <v-btn
      v-if="this.route === '/profile' && !settings"
      block
      large
      style="box-shadow: none;"
      dark
      color="#3ba776"
      class="mt-3"
      @click="emitProfileStatus('upload')"
    >Create auction</v-btn>

    <v-card v-if="settings" flat class="p-3 mt-3">
      <div>
        <input type="file" name="file" id="file" @change="picturePicked" class="inputfile" />
        <label for="file" class="p-1">
          <i class="material-icons mt-1">add_a_photo</i>
        </label>

        <v-textarea
          name="description"
          label="Bio"
          counter="100"
          color="#3ba776"
          v-model="description"
          required
          outline
          background-color="#f5f5f5"
          :rules="[rules]"
        ></v-textarea>

        <v-btn
          block
          style="box-shadow: none;"
          color="#3ba776"
          dark
          large
          @click="submitForm"
          :loading="loading"
        >
          Save
          <span slot="loader" class="custom-loader">
            <v-icon light>cached</v-icon>
          </span>
        </v-btn>
      </div>
    </v-card>

    <alert class="mt-3" v-if="alert"></alert>
  </div>
</template>

<script>
import ratingComponent from "./rating_component";
import alert from "../alert/notifications";
import { Bus } from "../../main";

export default {
  components: {
    ratingComponent,
    alert
  },
  data() {
    return {
      settings: false,
      description: "",
      rules: v => v.length <= 100 || "Description too long"
    };
  },
  methods: {
    emitProfileStatus(status) {
      Bus.$emit("profileStatus", status);
    },
    picturePicked(e) {
      if (e.target.files[0]) {
        let formData = new FormData();
        formData.append("photo", e.target.files[0]);
        return this.$store
          .dispatch("ownUser/updateProfilePicture", formData)
          .then(() => {
            return (this.settings = false);
          });
      }
    },
    submitForm() {
      if (this.description.length <= 100) {
        this.$store
          .dispatch("ownUser/changeDescription", this.description)
          .then(() => {
            this.description = "";
            return (this.settings = false);
          });
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.ownUser.user;
    },
    activeAuctions() {
      return this.$store.state.ownUser.activeAuctions;
    },
    alert() {
      return this.$store.state.alert.message;
    },
    loading() {
      return this.$store.state.generalStore.loading;
    },
    route() {
      return this.$route.path;
    },
    reviews() {
      return this.$store.state.ownUser.reviews;
    },
    sales() {
      return this.$store.state.ownUser.sales;
    }
  }
};
</script>
<style scoped>
.hoverDiv:hover {
  color: #3ba776;
  cursor: pointer;
  text-decoration: none;
}
h1 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 400;
  font-size: 20px;
}
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.inputfile + label {
  font-size: 15px;
  font-weight: 500;
  color: gray;
  background-color: #f5f5f5;
  display: inline-block;
  width: 100%;
  text-align: center;
  cursor: pointer;
  padding: 3px;
}
.inputfile:focus + label,
.inputfile + label:hover {
  background-color: #e5e5e5;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
