<template>
  <div>
    <v-card flat class="p-3 text-center">
      <v-progress-circular v-if="loading" :size="70" :width="7" color="#3ba776" indeterminate></v-progress-circular>
      <v-form v-if="!loading" @submit.prevent="submitData" v-model="valid">
        <small v-if="mainAlert" style="color:red;">All fields are required</small>
        <b-row>
          <b-col lg="12" id="imagesWrapper" class="mb-2"></b-col>
          <b-col lg="12">
            <div id="uploadWrapper">
              <input
                type="file"
                name="file"
                multiple
                @change="showPhotos"
                id="fileToUpload"
                class="inputfile"
              />
              <label for="fileToUpload" class="p-1">
                <i class="material-icons mt-1">add_a_photo</i>
              </label>
              <small
                v-if="!alert"
                class="ml-1"
                style="color: darkgray;"
              >Maximum 5 photographs in JPG or PNG format</small>
              <small v-else style="color: red;">At least one image is required</small>
            </div>
          </b-col>
        </b-row>
        <v-text-field
          v-model="formData.title"
          label="Title"
          :rules="rules.title"
          color="#3ba776"
          type="text"
          outline
          background-color="#f5f5f5"
          counter="50"
          required
        ></v-text-field>
        <v-textarea
          v-model="formData.description"
          name="description"
          label="Description"
          counter="700"
          color="#3ba776"
          outline
          background-color="#f5f5f5"
          :rules="rules.description"
          required
        ></v-textarea>
        <v-select
          v-model="formData.category"
          color="#3ba776"
          :items="category"
          label="Category"
          outline
          background-color="#f5f5f5"
          :rules="rules.category"
          required
        ></v-select>
        <v-select
          v-model="formData.city"
          color="#3ba776"
          :items="city"
          outline
          background-color="#f5f5f5"
          label="Location"
          :rules="rules.city"
          required
        ></v-select>
        <b-row>
          <b-col lg="5">
            <v-text-field
              v-model="formData.price"
              label="Price (S)"
              color="#3ba776"
              required
              outline
              background-color="#f5f5f5"
              :rules="rules.price"
              type="Number"
            ></v-text-field>
          </b-col>
          <b-col lg="7">
            <!--<b-row>-->
            <!--&lt;!&ndash;<b-col lg="2">&ndash;&gt;-->
            <!--&lt;!&ndash;<v-checkbox v-model="buyNow"&ndash;&gt;-->
            <!--&lt;!&ndash;color="#3ba776"&ndash;&gt;-->
            <!--&lt;!&ndash;hide-details class="shrink mr-2">&ndash;&gt;-->
            <!--&lt;!&ndash;</v-checkbox>&ndash;&gt;-->
            <!--&lt;!&ndash;</b-col>&ndash;&gt;-->
            <!--<b-col lg="10">-->
            <!--&lt;!&ndash;<v-text-field&ndash;&gt;-->
            <!--&lt;!&ndash;v-model="formData.buyNow"&ndash;&gt;-->
            <!--&lt;!&ndash;:disabled="!buyNow"&ndash;&gt;-->
            <!--&lt;!&ndash;type="number"&ndash;&gt;-->
            <!--&lt;!&ndash;color="#3ba776"&ndash;&gt;-->
            <!--&lt;!&ndash;:rules="rules.buyNow"&ndash;&gt;-->
            <!--&lt;!&ndash;label="Kaina perkant iš karto (€)"&ndash;&gt;-->
            <!--&lt;!&ndash;:error="buyNowError.error"&ndash;&gt;-->
            <!--&lt;!&ndash;:messages="buyNowError.message"&ndash;&gt;-->
            <!--&lt;!&ndash;&gt;</v-text-field>&ndash;&gt;-->
            <!--<v-text-field-->
            <!--v-model="formData.time"-->
            <!--label="Aukciono laikas (x24h). (Maksimaliai 7 dienos)*"-->
            <!--required-->
            <!--color="#3ba776"-->
            <!--type="Number"-->
            <!--:rules="rules.time"-->
            <!--&gt;</v-text-field>-->
            <!--</b-col>-->
            <!--</b-row>-->
            <v-text-field
              v-model="formData.time"
              label="Auction Duration in Hours"
              required
              color="#3ba776"
              outline
              background-color="#f5f5f5"
              type="Number"
              :rules="rules.time"
            ></v-text-field>
          </b-col>
        </b-row>
        <!--<b-row>-->
        <!--<b-col lg="6">-->
        <!--<v-checkbox-->
        <!--v-model="formData.handToHand"-->
        <!--label="I am shipping the item"-->
        <!--color="#3ba776"-->
        <!--&gt;</v-checkbox>-->
        <!--<small v-if="deliveryAlert"-->
        <!--style="color: red">-->
        <!--You must select at least one box-->
        <!--</small>-->
        <!--</b-col>-->
        <!--<b-col lg="6">-->
        <!--<v-checkbox-->
        <!--v-model="formData.shipping"-->
        <!--color="#3ba776"-->
        <!--label="Item can be picked up directly"-->
        <!--&gt;</v-checkbox>-->
        <!--</b-col>-->
        <!--</b-row>-->
        <v-btn
          color="#3ba776"
          block
          large
          dark
          type="submit"
          class="mt-0"
          style="box-shadow: none;"
        >Create auction</v-btn>
      </v-form>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      buyNow: false,
      buyNowError: {
        error: false,
        message: ""
      },
      valid: false,
      city: [
        "Seattle",
        "Portland",
        "San Francisco",
        "Los Angeles",
        "San Diego",
        "Denver",
        "Dallas",
        "Austin",
        "New York City",
        "Miami"
      ],
      category: [
        "Art",
        "Cars",
        "Electronics",
        "Furniture",
        "Entertainment",
        "Clothing",
        "Real Estate",
        "Other"
      ],
      formData: {
        title: "",
        description: "",
        photo: [],
        category: null,
        city: null,
        price: "",
        buyNow: "",
        time: "",
        handToHand: false,
        shipping: false
      },
      alert: false,
      deliveryAlert: false,
      mainAlert: false,
      rules: {
        title: [
          v => v.length < 50 || "Title is too long",
          v => v.length > 0 || "Title is too short"
        ],
        description: [
          v => v.length < 700 || "Description is too long",
          v => v.length > 0 || "Description is too short"
        ],
        category: [v => v != null || "Category cant be blank"],
        city: [v => v != null || "City cant be blank"],
        price: [v => v.length > 0 || "Please enter a price"],
        time: [
          v => v.length > 0 || "Time must be more than 1 hour",
          // v => v <= 168 || "Auction cannot last longer than 7 days or 168 hours"
        ]
      }
    };
  },
  props: ["loading"],
  watch: {
    buyNow(val) {
      if (!val) {
        this.buyNowError.error = false;
        this.buyNowError.message = "";
        return (this.formData.buyNow = "");
      }
      if (val && this.formData.buyNow.length < 1) {
        this.buyNowError.error = true;
        return (this.buyNowError.message = "Required field if checked");
      } else {
        this.buyNowError.error = false;
        return (this.buyNowError.message = "");
      }
    },
    "formData.buyNow"(val) {
      if (val.length === 0 && this.buyNow) {
        this.buyNowError.error = true;
        return (this.buyNowError.message = "Required field if checked");
      } else {
        this.buyNowError.error = false;
        return (this.buyNowError.message = "");
      }
    }
  },
  methods: {
    showPhotos(e) {
      if (e.target.files.length > 5) {
        return alert("Select up to five pictures");
      }
      let fileAmount = e.target.files.length;
      this.formData.photo = [];
      this.alert = false;
      document.getElementById("imagesWrapper").innerHTML = "";
      for (let i = 0; i < fileAmount; i++) {
        let reader = new FileReader();
        reader.onload = function() {
          let para = document.createElement("img");
          para.setAttribute("class", "p-1");
          para.setAttribute("style", "height: 80px;");
          para.src = reader.result;
          let element = document.getElementById("imagesWrapper");
          element.appendChild(para);
        };
        this.formData.photo.push(e.target.files[i]);
        reader.readAsDataURL(e.target.files[i]);
      }
    },
    submitData() {
      if (this.valid) {
        if (this.formData.photo.length < 1) {
          return (this.alert = true);
        }
        // if (this.formData.handToHand === false && this.formData.shipping === false) {
        //     return this.deliveryAlert = true
        // }
        this.buyNowError.error = false;
        this.buyNowError.message = "";
        this.deliveryAlert = false;
        this.mainAlert = false;
        return this.sendForm(this.formData);
      }
      return (this.mainAlert = true);
    },
    sendForm(data) {
      let formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("city", data.city);
      formData.append("price", data.price);
      formData.append("buyNow", data.buyNow);
      formData.append("time", data.time);
      formData.append("handToHand", data.handToHand);
      formData.append("shipping", data.shipping);
      for (let x = 0; x < data.photo.length; x++) {
        formData.append("photo", data.photo[x]);
      }
      return this.$store
        .dispatch("ownUser/uploadNewAuction", formData)
        .then(() => {
          this.$store.dispatch("ownUser/getOwnAuctions").then(() => {
            return this.$emit("changed", "active");
          });
        });
    }
  }
};
</script>
<style scoped>
#uploadWrapper {
  width: 100%;
  position: relative;
  overflow: hidden;
  display: inline-block;
}
#uploadWrapper input[type="file"] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
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
</style>
