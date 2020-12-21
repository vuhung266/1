<template>
  <div>
    <CRow>
        <CCol md="6">
            <CCard>
            <CCardHeader>
                <CIcon name="cil-User" /> Thông tin cá nhân
            </CCardHeader>
            <CCardBody>
                <p>Họ tên: {{userInfo.name}}</p>
                <p>Địa chỉ email: {{userInfo.email}}</p>
                <p>Ngày tạo: {{userInfo.createdAt}}</p>
            </CCardBody>
            </CCard>
        </CCol>
        <CCol md="6">
            <CCard>
            <CCardHeader>
                <CIcon name="cil-User" /> Ảnh đại diện
            </CCardHeader>
            <CCardBody>
                <img src="http://pintuanphuong.com.vn/public/products/Asset 4@4x.png" height=50px />
                <p><input type="file" id="file" ref="file" v-on:change="onChangeFileUpload()"/></p>
                <p><CButton v-on:click="submitForm()" color="success">Upload</CButton></p>
            </CCardBody>
            </CCard>
        </CCol>
    </CRow>
    <CRow>
        <CCol md="6">
            <CCard>
            <CCardHeader>
                <CIcon name="cil-User" /> Đổi mật khẩu
            </CCardHeader>
            <CCardBody>
                <CRow>
                    <CCol sm="12">
                        <CInput label="Mật khẩu cũ" type="password" v-model="oldpass"  />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol sm="12">
                        <CInput label="Mật khẩu mới" type="password" v-model="newpass1" 
                                valid-feedback="Input is valid."
                                invalid-feedback="Mật khẩu mới có độ dài hơn 6 ký tự"
                                value="Valid value"
                                :is-valid="validator"  />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol sm="12">
                        <CInput label="Xác nhận mật khẩu mới" type="password" v-model="newpass2"  />
                    </CCol>
                </CRow>
            </CCardBody>
            <CCardFooter class="d-flex justify-content-end">
                <CButton @click="resetData()" color="danger" class="mr-2">Hủy</CButton>
                <CButton @click="senddata()" color="success">Xác nhận</CButton>
            </CCardFooter>
            </CCard>
        </CCol>
    </CRow>
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
export default {
  data () {
    return {
      userInfo: [],
      fixedToasts: 0,
      thongbaoloi:[],
      oldpass:'',
      newpass1:'',
      newpass2:''
    }
  },
  created: function () {
    //axios.defaults.headers.common['Authorization'] = this.apiBimat;
    axios.defaults.headers.common['Authorization'] = 12345;
    axios.defaults.headers.common['url'] = 'products/';
  },
  mounted() {
    //this.importAll(require.context('../imgs/', true, /\.jpg$/));
  },
  methods: {
    sendEditData: function(e) {
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        const payload = {
          name: this.dataEdit.name,
          mota: this.dataEdit.mota,
        };

        //Send data with form url using querystring node package for it.
        axios
          .put('http://pintuanphuong.com.vn/api/v1/hangsx/'+e, qs.stringify(payload), {
            headers: headers
          })
          .then(res => {
            console.log(res.data);
            this.thongbaoloi = res.data;
            this.disabled= false;
          })
          .catch(err => {
            console.log(err);
          });
          this.myModal = false;
          this.fixedToasts++
    },
    resetData: function(){
       this.oldpass=''; this.newpass1=''; this.newpass2=''; 
    },
    validator (val) {
      return val ? val.length >= 6 : false
    },
    submitForm(){
            let formData = new FormData();
            formData.append('file', this.file);

            axios.post('http://pintuanphuong.com.vn/public/api.php',
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              }
            ).then(function(data){
              console.log(data.data);
            })
            .catch(function(){
              console.log('FAILURE!!');
            });
      },
  
      onChangeFileUpload(){
        this.file = this.$refs.file.files[0]; console.log(this.file);
      },

      importAll(r) {
        r.keys().forEach(key => (this.images.push({ pathLong: r(key), pathShort: key })));
      },
  }
}
</script>
<style scoped>
.fakeinput {padding: 0.46rem 0.8rem;display: inline-block;}
</style>