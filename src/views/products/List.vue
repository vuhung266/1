<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-Puzzle" color="danger" /> Danh sách sản phẩm
        <div class="card-header-actions">
          <CLink href="#" class="card-header-action btn-setting" @click="gotoUrl('/products/addnew')">
            <CIcon name="cil-settings" />
          </CLink>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow v-for="item in products" :key="item.id" class="flex-row align-items-center border-bottom mt-2 pb-3">
            <CCol col="12" md="2" lg="1">
                <img :src="item.img" class="w-100"/>
            </CCol>
            <CCol col="12" md="6" lg="9">
            <CLink @click="xemChiTietSP(item.id)" class="text-muted"> <b>{{item.name}}</b> </CLink><br/>
              <small>Hãng: <span class="text-success">{{item.hangsanxuat}}</span> | Bảo hành: <span class="text-success">{{item.thoigianbaohanh}}</span></small>
            </CCol>
            <CCol col="12" md="4" lg="2" class="text-center">
                <CButton color="danger" variant="outline" size="sm" @click="deleteAsk(item.id)" class="mr-2">
                    <CIcon name="cil-XCircle" /> Xóa
                </CButton>
                <CButton color="primary" variant="outline" size="sm" @click="edit(item.id)">
                    <CIcon name="cil-pencil" /> Sửa
                </CButton>
            </CCol>
        </CRow>    
      </CCardBody>
    </CCard>

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

    <CModal title="Sửa thông tin sản phẩm" :show.sync="myModal" size="lg">
      <CCardBody>
        <CRow>
          <CCol sm="6">
            <CInput label="Tên sản phẩm" v-model="dataedit.name"  />
          </CCol>
          <CCol sm="6">
            <CInput label="Mã sản phẩm" v-model="dataedit.procode"  />
          </CCol>
          <CCol sm="6">
            <div class="form-group">
              <label>Loại sản phẩm</label>
              <select class="form-control" v-model="dataedit.loaisp">
                  <option v-for="item in loaisp" :key="item.id" :value="item.id" >
                    {{item.name}}
                  </option>
              </select>
            </div>
          </CCol>
          <CCol sm="6">
            <div class="form-group">
              <label>Hãng sản xuất</label>
              <select class="form-control" v-model="dataedit.hangsx">
                  <option v-for="item in hangsx" :key="item.id" :value="item.id" >
                    {{item.name}}
                  </option>
              </select>
            </div>
          </CCol>
          <CCol sm="6">
            <div class="form-group">
              <label>Thời gian bảo hành</label>
              <select class="form-control" v-model="dataedit.baohanh">
                  <option v-for="item in timebaohanh" :key="item.id" :value="item.id" >
                   {{item.name}}
                  </option>
              </select>
            </div>
          </CCol>
          <CCol sm="6">
            <div class="form-group">
              <div class="float-left inline-block">
              <label>Ảnh đại diện</label>
              <input class="form-control" type="file" id="file" ref="file" v-on:change="onChangeFileUpload()" style="padding:3px"/>
              </div>
              <img :src="dataedit.img" class="float-left" style="max-width:90px" />
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <CTextarea
                label="Mô tả"
                v-model="dataedit.description"
                rows="3"
              />
          </CCol>
        </CRow>
      </CCardBody>
      <template #footer>
        <CButton @click="myModal = false" color="danger">Hủy</CButton>
        <CButton @click="sendEditData(dataedit.id)" color="success">Sửa thông tin</CButton>
      </template>
    </CModal>

    <CModal
      :show.sync="ModalDelete"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="dark"
    >
      Bạn có muốn xóa sản phẩm: <b class="color-primary"> {{itemBiXoa.name}} </b>khỏi hệ thống?
      <template #header>
        <h6 class="modal-title">Thông báo</h6>
        <CButtonClose @click="ModalDelete = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="ModalDelete = false" color="danger">Hủy</CButton>
        <CButton @click="deleteitem(itemBiXoa.id)" color="success">Xóa</CButton>
      </template>
    </CModal>

  </div>
</template>

<script>
import axios from 'axios';
const qs = require('querystring');
//import { cibOsi } from '@coreui/icons';
export default {
  data () {
    return {
      myModal: false,
      products: [],
      dataedit: [],
      ketqua:[],
      fixedToasts: 0,
      thongbaoloi:[],
      ModalDelete: false,
      itemBiXoa:[],
      loaisp:[{id:1, name: "Pin tiểu"},{id:2, name: "Pin Đũa"},{id:3, name: "Sạc pin"},],
      hangsx:[],
      timebaohanh:[],
    }
  },
  created: function () {
    axios.defaults.headers.common['Authorization'] = this.apiBimat;
    this.getAllProducts();
  },
  methods: {
    getAllProducts: function(){
      axios.get('http://pintuanphuong.com.vn/api/v1/sanpham')
        .then(response => {
          this.products = response.data.products; 
        })
    },
    
    getAllTimeBaoHanh: function(){
        axios.get('http://pintuanphuong.com.vn/api/v1/timebaohanh')
        .then(response => {
          this.timebaohanh = response.data.data;
        })
    },

    getAllHangsx: function(){
      axios.get('http://pintuanphuong.com.vn/api/v1/hangsx')
        .then(response => {
          this.hangsx = response.data.hangsx; 
        })
    },
    
    edit: function(e) {
      this.getAllTimeBaoHanh();
      this.getAllHangsx();
      this.myModal= true;
      this.dataedit = this.getValuebyId(this.products, e); 
    },
    
    getValuebyId (arr, idSp) {
      for (var i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i].id === idSp) {
          return arr[i];
        }
      }
    },

    sendEditData: function(e) {
        let formData = new FormData();
            if(this.file){  //check xem nếu chọn file
              var tenanh = this.file.name;
              formData.append('file', this.file);
              axios.post('http://pintuanphuong.com.vn/public/api.php',
                  formData,
                  {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
                }
              ).then(getdata =>{ 
                if(getdata.data == 'success'){
                  console.log('đã đẩy ảnh sản phẩm lên server')
                  this.dataedit.img = 'http://pintuanphuong.com.vn/public/products/'+tenanh;
                  this.updateTextEdit(e);
                }else {
                  this.dataedit.img = '';
                  console.log('ko đẩy đc file');
                }
              })
            }else{
              this.updateTextEdit(e);
            }
    },

    updateTextEdit: function(e){
      const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        const payload = {
          name:         this.dataedit.name,
          procode:      this.dataedit.procode,
          hangsx:       this.dataedit.hangsx,
          baohanh:      this.dataedit.baohanh,
          img:         this.dataedit.img,
          description:  this.dataedit.description,
        };

        //Send data with form url using querystring node package for it.
        axios
          .put('http://pintuanphuong.com.vn/api/v1/sanpham/'+e, qs.stringify(payload), {
            headers: headers
          })
          .then(res => {
            console.log(res.data);
            this.thongbaoloi = res.data;
            this.getAllProducts();
          })
          .catch(err => {
            console.log(err);
          });
          
          this.myModal = false;
          this.fixedToasts++
    },

    deleteAsk: function(e){
      this.ModalDelete = true;
      this.itemBiXoa = this.getValuebyId(this.products, e);  
    },

    deleteitem: function(e) {
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        //Send data with form url using querystring node package for it.
        axios
          .delete('http://pintuanphuong.com.vn/api/v1/sanpham/'+e, {
            headers: headers
          })
          .then(res => {
            console.log(res.data);
            this.thongbaoloi = res.data;
            this.getAllProducts();
            this.ModalDelete = false;
          })
          .catch(err => {
            console.log(err);
          });
          this.myModal = false;
          this.fixedToasts++
    },

    xemChiTietSP: function(e){
      this.$router.push({ path: '/products/detail/'+e });
    },

    onChangeFileUpload(){
        this.file = this.$refs.file.files[0];
    },

    gotoUrl: function(e){
      this.$router.push({path: e}).catch(err => {});
    }
  }
}
</script>
<style scoped>
.fakeinput {padding: 0.46rem 0.8rem;display: inline-block;}
</style>