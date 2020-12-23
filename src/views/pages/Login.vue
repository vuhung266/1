<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="4">
          <CCardGroup>
            <CCard class="p-2">
              <CCardBody>
                <CForm>
                  <h1>Đăng nhập</h1>
                  <p class="text-muted">Hệ thống quản trị</p>
                  <CInput
                    placeholder="Tài khoản"
                    autocomplete="username email"
                    v-model="email"
                    :description = validateText
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput
                    placeholder="Mật khẩu"
                    type="password"
                    autocomplete="curent-password"
                    v-model="password"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton type="submit" color="primary" class="px-4" @click="senddata()">Đằng nhập</CButton>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0" @click="addstore()">Quên mật khẩu?</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
    <CToaster :autohide="2000">
      <template v-for="toast in fixedToasts">
        <CToast
          :key="'toast' + toast"
          :show="true"
          header="Thông báo"
        >
         <i class="cil-XCircle"></i> {{thongbaoloi.message}}.
        </CToast>
      </template>
    </CToaster>
  </div>
</template>

<script>
import axios from 'axios';
const qs = require('querystring');
import VueCookies from 'vue-cookies';
export default {
  middleware: 'authenticated',
  data() {
    return{
      email:'',
      password: '',
      fixedToasts: 0,
      thongbaoloi:[],
      auth: [],
      validateText:'',
    }
  },
  created: function () {
    
  },
  methods: {
    senddata: function(){ 
      const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        const payload = {
          email: this.email,
          password: this.password,
        };
        if( this.email != ''){
          this.validateText = ''
          axios.post('https://pintuanphuong.com.vn/api/v1/login', qs.stringify(payload), {
            headers: headers
          })
          .then(res => { console.log(res);
            this.thongbaoloi = res.data.message;
            if(res.data.error == false){
              this.auth = res.data;
              this.$store.commit('set', ['auth', this.auth]);
              window.localStorage.auth = true;
              VueCookies.set('user_data', res.data);
              this.$router.push({ path: '/' });
            }
          })
          .catch(err => {
            console.log(err);
          });
          this.fixedToasts++;
        }else {
          this.validateText = 'Nhập thông tin tài khoản'
        }
    },
    addstore: function() {
      console.log(this.$store.state.auth);
    },
    
  },
}
</script>
