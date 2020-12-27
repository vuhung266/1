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
                <p>Ngày tạo: {{userInfo.created_at}}</p>
            </CCardBody>
            </CCard>
        </CCol>
        <CCol md="6">
            <CCard>
            <CCardHeader>
                <CIcon name="cil-User" /> Ảnh đại diện
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md="4">
                  <div v-if="userInfo.avatar"><img :src="userInfo.avatar" height=50px /></div>
                </CCol>
                <CCol md="8">
                  <input type="file" id="file" name="file" ref="file" v-on:change="onChangeFileUpload()"/>
                </CCol>
              </CRow>  
            </CCardBody>
             <CCardFooter class="d-flex justify-content-end">
                <CButton v-on:click="submitForm()" color="success">Upload</CButton>
            </CCardFooter>
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
                <CButton @click="getUserInfo()" color="info" class="mr-2">Hủy</CButton>
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
<script src="https://unpkg.com/vue-image-upload-resize"></script>
<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';
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
    axios.defaults.headers.common['Authorization'] = this.apiBimat;
    this.getUserInfo(this.apiBimat);
    axios.defaults['masobimat'] = 12345;
    axios.defaults['url'] = 'products/'; 

  },
  mounted() {
    //this.importAll(require.context('../imgs/', true, /\.jpg$/));
  },
  methods: {
    uploaddemo: function(){
      var formData = new FormData();
      var imagefile = document.querySelector('#file'); 
      formData.append("image", imagefile.files[0]);
      axios.post('http://pintuanphuong.com.vn/api/v1/uploadfile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      }).then(getdata =>{ 
                console.log(getdata);
              })
    },
    getUserInfo: function(e){
      axios.get('http://pintuanphuong.com.vn/api/v1/getuserinfo/'+e)
        .then(response => {
          this.userInfo = response.data;
      })  
    },
    setImage: function(output) {
      this.hasImage = true;
      this.image = output;
      console.log(output.info)
      console.log('Exif', output.exif)
    },
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
    submitForm: function() {
            let formData = new FormData();
            if(this.file){  //check xem nếu chọn file
              var tenanh = this.file.name;
              formData.append('file', this.file);
              axios.post('http://pintuanphuong.com.vn/public/api.php',
                  formData,
                  {
                  headers: {
                      //'Content-Type': 'multipart/form-data'
                      'Content-Type': 'application/x-www-form-urlencoded'
                  }
                }
              ).then(getdata =>{ console.log(getdata);
                if(getdata.data == 'success'){
                  this.updateTextAvatar(tenanh);
                }else {
                  console.log('ko đẩy đc file');
                }
               
              })
            }else{
              this.thongbaoloi.message = 'Chưa chọn file';
              this.fixedToasts++;
               
            }
            
    },
    updateTextAvatar: function(tenanh) { 
      const headers1 = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      const payload1 = {
        avatar: 'http://pintuanphuong.com.vn/public/products/'+ tenanh
        
      };
      axios.put('http://pintuanphuong.com.vn/api/v1/updateavatar/106fd140cb42137bec5226ffe3cae78d', qs.stringify(payload1), {
          headers: headers1
      })
      .then(res => { console.log(res.data.message);
        this.thongbaoloi.message = res.data.message;
        this.fixedToasts++;
        this.getUserInfo(this.apiBimat);
        this.$refs.file.files[0] = '';
      })
    },  
    onChangeFileUpload(){
        this.file = this.$refs.file.files[0]; 
    },

    importAll(r) {
        r.keys().forEach(key => (this.images.push({ pathLong: r(key), pathShort: key })));
    },

    getavatarfromcookie: function(){
       this.userdata = $cookies.get('user_data'); console.log(this.userdata);
       console.log(this.userInfo);
    }
  }
}
</script>
<style scoped>
.fakeinput {padding: 0.46rem 0.8rem;display: inline-block;}
</style>