<template>
  <div class="sites-wrap">
    <div class="content">
      <div v-if="loading">
        <md-progress-bar md-mode="indeterminate"></md-progress-bar>
      </div>
      <div v-else>
        <div class="action-buttons">
          <md-button class="md-icon-button md-primary" v-on:click="onAddClick">
            <md-icon class="md-size-2x">add_circle</md-icon>
            <md-tooltip md-direction="right">Add New</md-tooltip>
          </md-button>
          <md-button class="md-icon-button md-primary" v-on:click="onSaveClick">
            <md-icon class="md-size-2x">save_alt</md-icon>
            <md-tooltip md-direction="right">Save</md-tooltip>
          </md-button>
        </div>
        <div v-for="(site, idx) in data.certificates" v-bind:key="site.domain">
          <md-card class="card">
            <md-card-header class="card-header">
              <md-card-expand-trigger>
                <md-button class="md-icon-button">
                  <md-icon>keyboard_arrow_down</md-icon>
                </md-button>
              </md-card-expand-trigger>
              {{ site.domain }}
            </md-card-header>
            <md-card-expand>
              <md-card-expand-content>
                <md-card-content class="card-content">
                  <md-field :class="{ 'md-invalid': !site.storageConnectionString }">
                    <label>Storage Connection String</label>
                    <md-input v-model="site.storageConnectionString" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field class="field-30" :class="{ 'md-invalid': !site.storageContainerName }">
                    <label>Storage Container Name</label>
                    <md-input v-model="site.storageContainerName" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field class="field-30" :class="{ 'md-invalid': !site.storageContainerPath }">
                    <label>Storage File Path</label>
                    <md-input v-model="site.storageContainerPath" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field class="field-30" :class="{ 'md-invalid': !site.domain }">
                    <label>Domain</label>
                    <md-input v-model="site.domain" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field class="field-30" :class="{ 'md-invalid': !site.countryName }">
                    <label>County Name</label>
                    <md-input v-model="site.countryName" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field class="field-30" :class="{ 'md-invalid': !site.state }">
                    <label>State</label>
                    <md-input v-model="site.state" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field class="field-30" :class="{ 'md-invalid': !site.locality }">
                    <label>Locality</label>
                    <md-input v-model="site.locality" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field class="field-30" :class="{ 'md-invalid': !site.organization }">
                    <label>Organization</label>
                    <md-input v-model="site.organization" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field class="field-30" :class="{ 'md-invalid': !site.organizationUnit }">
                    <label>Organization Unit</label>
                    <md-input v-model="site.organizationUnit" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field class="field-30" :class="{ 'md-invalid': !site.commonName }">
                    <label>Common Name</label>
                    <md-input v-model="site.commonName" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field class="field-30" :class="{ 'md-invalid': !site.certificateName }">
                    <label>Certificate Name</label>
                    <md-input v-model="site.certificateName" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field class="field-30" :class="{ 'md-invalid': !site.subscriptionId }">
                    <label>Subscription Id</label>
                    <md-input v-model="site.subscriptionId" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field class="field-30" :class="{ 'md-invalid': !site.listenerName }">
                    <label>Listener Name</label>
                    <md-input v-model="site.listenerName" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <md-field :class="{ 'md-invalid': !site.gatewayId }">
                    <label>Gateway Id</label>
                    <md-input v-model="site.gatewayId" required></md-input>
                    <span class="md-error">This field is required</span>
                  </md-field>
                  <div class="action-buttons">
                  <md-button class="md-icon-button md-accent" v-on:click="onDeleteClick(idx)">
                    <md-icon>delete</md-icon>
                    <md-tooltip md-direction="right">Delete</md-tooltip>
                  </md-button>
                  <md-button class="md-icon-button md-primary" v-on:click="onSubmitForRenewalClick(site)">
                    <md-icon>security</md-icon>
                    <md-tooltip md-direction="right">Submit for renewal</md-tooltip>
                  </md-button>
                  </div>
                </md-card-content>
              </md-card-expand-content>
            </md-card-expand>
          </md-card>
        </div>
      </div>
      <div v-if="error">{{ error }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AuthResponse } from "msal";
import { environment } from "../environments/environment";
import { Observable, from } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { AxiosRequestConfig } from "axios";

@Component
export default class SitesComponent extends Vue {
  data: Sites = { certificates: [] };
  loading = true;
  error = null;

  mounted() {
    this.axios.interceptors.request.use(this.addAuthHeader);
    this.getData();
  }

  addAuthHeader(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const result = this.getToken().pipe(
      map(response => {
        const token = "Bearer " + response.accessToken;
        config.headers = { Authorization: token };
        return config;
      })
    );

    return result.toPromise();
  }

  getData() {
    this.error = null;
    from(this.axios.get(environment.apiURL + "Configuration"))
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        x => (this.data = x.data),
        error => console.log(error)
      );
  }

  onAddClick() {
    this.data.certificates.push({
      domain: "example.com"
    });
  }

  onDeleteClick(index: number) {
    if (index < this.data.certificates.length) {
      this.data.certificates.splice(index, 1);
    }
  }

  onSaveClick() {
    this.loading = true;

    from(this.axios.put(environment.apiURL + "Configuration", this.data))
    .pipe(finalize(() => this.loading = false))
    .subscribe(
      () => this.getData(), 
      error => {
        console.log(error);
        this.error = error;
    });
  }

  onSubmitForRenewalClick(site: Site) {
    if(site) {
       this.loading = true;

    from(this.axios.post(environment.apiURL + "Certificate/updateCertificate", site))
    .pipe(finalize(() => this.loading = false))
    .subscribe(
      () => this.getData(), 
      error => {
        console.log(error);
        this.error = error;
    });
    }
  }

  getToken(): Observable<AuthResponse> {
    if (this.msal.getAccount()) {
      const tokenRequest = {
        scopes: environment.MSALSettings.apiScopes
      };
      return from(this.msal.acquireTokenSilent(tokenRequest));
    } else {
      throw "Invalid account information, login first";
    }
  }
}

export interface Sites {
  certificates: Array<Site>;
}

export interface Site {
  storageConnectionString?: string;
  storageContainerName?: string;
  storageContainerPath?: string;
  domain?: string;
  countryName?: string;
  state?: string;
  locality?: string;
  organization?: string;
  organizationUnit?: string;
  commonName?: string;
  certificateName?: string;
  subscriptionId?: string;
  gatewayId?: string;
  listenerName?: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sites-wrap {
  display: flex;
  justify-content: space-around;
}

.content {
  width: 70%;
}

.card-header {
  text-align: left;
  background-color: #42b983;
}

.field-30 {
  width: 30%;
  margin-right: 3%;
}

.card-content {
  display: flex;
  flex-wrap: wrap;
}

.card {
  border: 1px grey solid;
}

.button-left {
  text-align: left;
  margin-bottom: 10px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

</style>
