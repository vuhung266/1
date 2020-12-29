<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-trash" /> Thùng rác
      </CCardHeader>
      <CCardBody>
          <div>
            <CCard class="mb-2">
              <CButton 
                block 
                class="text-left shadow-none card-header border-top-0 border-left-0 border-right-0 d-flex justify-content-between align-items-center" 
                @click="accordion = accordion === 0 ? false : 0" 
              >
                <b>Các Hãng sản xuất đã bị xóa</b> <CBadge color="danger" shape="pill">{{CountHangsx}}</CBadge>
              </CButton>
              <CCollapse :show="accordion === 0">
                <CCardBody>
                 <Table class="table table-bordered">
                  <tr v-for="item in hangsx" :key="item.id">
                    <td>
                      <span class="fakeinput">
                        {{item.name}} 
                      </span>
                    </td>
                    <td style="width:240px">
                      <CButton color="danger" variant="outline" size="sm" class="mr-2" @click="confirmDelete(item.id,'hangsx')">
                        <CIcon name="cil-XCircle" /> Xóa vĩnh viễn
                      </CButton>
                      <CButton color="primary" variant="outline" size="sm" @click="confirmOrder(item.id,'hangsx')">
                        <CIcon name="cil-Reload" /> Khôi phục
                      </CButton>
                    </td>
                  </tr>
                </Table>
                </CCardBody>
              </CCollapse>
            </CCard>
            <CCard class="mb-2">
              <CButton 
                block 
                class="text-left shadow-none card-header border-top-0 border-left-0 border-right-0 d-flex justify-content-between align-items-center" 
                @click="accordion = accordion === 1 ? false : 1" 
              >
                <b>Thời gian bảo hành đã bị xóa</b> <CBadge color="danger" shape="pill">{{CountTimebaohanh}}</CBadge>
              </CButton>
              <CCollapse :show="accordion === 1">
                <CCardBody>
                  <Table class="table table-bordered">
                    <tr v-for="item in timebaohanh" :key="item.id">
                      <td>
                        <b>{{item.name}}</b><br/>
                        <i>{{item.mota}}</i>
                      </td>
                      <td style="width:240px">
                        <CButton color="danger" variant="outline" size="sm" @click="" class="mr-2" @click="confirmDelete(item.id,'timebaohanh')">
                          <CIcon name="cil-XCircle" /> Xóa vĩnh viễn
                        </CButton>
                        <CButton color="primary" variant="outline" size="sm"  @click="confirmOrder(item.id,'timebaohanh')">
                          <CIcon name="cil-Reload" /> Khôi phục
                        </CButton>
                      </td>
                    </tr>
                  </Table>
                </CCardBody>
              </CCollapse>
            </CCard>
            <CCard class="mb-2">
              <CButton 
                block 
                class="text-left shadow-none card-header border-top-0 border-left-0 border-right-0 d-flex justify-content-between align-items-center" 
                @click="accordion = accordion === 2 ? false : 2" 
              >
                <b>Các sản phẩm đã bị xóa</b> <CBadge color="danger" shape="pill">{{CountProducts}}</CBadge>
              </CButton>
              <CCollapse :show="accordion === 2">
                <CCardBody>
                  <CRow v-for="item in products" :key="item.id" class="flex-row align-items-center border-bottom mt-2 pb-3">
                      <CCol col="12" md="2" lg="1">
                          <img :src="item.img" class="w-100"/>
                      </CCol>
                      <CCol col="12" md="6" lg="7">
                      <CLink @click="xemChiTietSP(item.id)" class="text-muted"> <b>{{item.name}}</b> </CLink><br/>
                        <small>Hãng: <span class="text-success">{{item.hangsanxuat}}</span> | Bảo hành: <span class="text-success">{{item.thoigianbaohanh}}</span></small>
                      </CCol>
                      <CCol col="12" md="6" lg="4" class="text-center">
                          <CButton color="danger" variant="outline" size="sm" class="mr-2" @click="confirmDelete(item.id,'products')">
                              <CIcon name="cil-XCircle" /> Xóa vĩnh viễn
                          </CButton>
                          <CButton color="primary" variant="outline" size="sm"  @click="confirmOrder(item.id,'products')">
                              <CIcon name="cil-Reload" /> Khôi phục
                          </CButton>
                      </CCol>
                  </CRow>
                </CCardBody>
              </CCollapse>
            </CCard>
          </div>
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

    <CModal
      :show.sync="ModalDisplay"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="dark"
    >
      Bạn có muốn khôi phục bản ghi này không?
      <template #header>
        <h6 class="modal-title">Thông báo</h6>
        <CButtonClose @click="ModalDisplay = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="ModalDisplay = false" color="danger">Hủy</CButton>
        <CButton v-show=" show_btn_product      == true" color="success" @click="revertItem(idchoice, 'sanphamrevert')"     >Khôi phục sản phẩm</CButton>
        <CButton v-show=" show_btn_hangsx       == true" color="success" @click="revertItem(idchoice, 'hangsxrevert')"      >Khôi phục</CButton>
        <CButton v-show=" show_btn_timebaohanh  == true" color="success" @click="revertItem(idchoice, 'timebaohanhrevert')" >Khôi phục</CButton>
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
      <h4>Bạn có muốn xóa vĩnh viễn bản ghi này không?</h4>
      Lưu ý: Bản ghi bị xóa sẽ không khôi phục được nữa
      <template #header>
        <h6 class="modal-title">Thông báo</h6>
        <CButtonClose @click="ModalDelete = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="ModalDelete = false" color="danger">Hủy</CButton>
        <CButton v-show=" show_btn_product      == true" color="success" @click="removeitem(idchoice,'sanphamremove')"      >Xóa vĩnh viễn sản phẩm</CButton>
        <CButton v-show=" show_btn_hangsx       == true" color="success" @click="removeitem(idchoice,'hangsxremove')"       >Xóa vĩnh viễn</CButton>
        <CButton v-show=" show_btn_timebaohanh  == true" color="success" @click="removeitem(idchoice,'timebaohanhremove')"  >Xóa vĩnh viễn</CButton>
      </template>
    </CModal>

  </div>
</template>
<script>
import axios from 'axios';
const qs = require('querystring');
export default {
  data () {
    return {
      show_btn_product:false,
      show_btn_hangsx:false,
      show_btn_timebaohanh:false,
      idchoice:'',
      tenbanghi: '',
      products:[],
      hangsx:[],
      timebaohanh: [],
      thongbaoloi: [],
      fixedToasts: 0,
      ModalDisplay: false,
      ModalDelete: false,
      collapse: false,
      cardCollapse: true,
      innerCollapse: false,
      accordion: 0,
      CountHangsx: 0,
      CountTimebaohanh:0,
      CountProducts:0
    }
  },
  created: function () {
    axios.defaults.headers.common['Authorization'] = this.apiBimat;
    this.getAllHangsxDaXoa();
    this.getAllTimeBaoHanhDaXoa();
    this.getAllProductsDaXoa();
  },
  methods: {
    getAllHangsxDaXoa: function(){
      axios.get('http://pintuanphuong.com.vn/api/v1/hangsxdaxoa')
        .then(response => {
          this.hangsx = response.data.hangsx; 
          this.CountHangsx = this.hangsx.length;
        })
    },
    getAllTimeBaoHanhDaXoa: function(){
      axios.get('http://pintuanphuong.com.vn/api/v1/timebaohanhdaxoa')
        .then(response => {
          this.timebaohanh = response.data.data;
          this.CountTimebaohanh = this.timebaohanh.length;
        })
    },
    getAllProductsDaXoa: function(){
      axios.get('http://pintuanphuong.com.vn/api/v1/sanphamdaxoa')
        .then(response => {
          this.products = response.data.products; 
          this.CountProducts = this.products.length;
        })
    },

    confirmOrder: function(e, type){
      this.idchoice = e;
      this.ModalDisplay = true;
      if(type == 'products'){
        this.show_btn_hangsx      = false;
        this.show_btn_product     = true;
        this.show_btn_timebaohanh = false;  
      }
      if(type == 'hangsx'){
        this.show_btn_hangsx      = true;
        this.show_btn_product     = false;
        this.show_btn_timebaohanh = false;
      }
      if(type == 'timebaohanh'){
        this.show_btn_hangsx      = false;
        this.show_btn_product     = false;
        this.show_btn_timebaohanh = true;
      }
    },
    revertItem:function(e, link){
      const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
      };
      axios
        .put('http://pintuanphuong.com.vn/api/v1/'+link+'/'+e, {
          headers: headers
        })
        .then(res => {
          this.thongbaoloi = res.data;
          this.ModalDisplay = false;
          if(link == 'sanphamrevert'){
            this.getAllProductsDaXoa();
          }
          if(link == 'hangsxrevert'){
            this.getAllHangsxDaXoa();
          }
          if(link == 'timebaohanhrevert'){
            this.getAllTimeBaoHanhDaXoa();
          }
        })
        .catch(err => {
          console.log(err);
        });
        this.fixedToasts++
    },

    confirmDelete: function(e, type){
      this.idchoice = e;
      this.ModalDelete = true;
      if(type == 'products'){
        this.show_btn_hangsx      = false;
        this.show_btn_product     = true;
        this.show_btn_timebaohanh = false;  
      }
      if(type == 'hangsx'){
        this.show_btn_hangsx      = true;
        this.show_btn_product     = false;
        this.show_btn_timebaohanh = false;
      }
      if(type == 'timebaohanh'){
        this.show_btn_hangsx      = false;
        this.show_btn_product     = false;
        this.show_btn_timebaohanh = true;
      }
    },
    removeitem:function(e, link){
      const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
      };
      axios
        .put('http://pintuanphuong.com.vn/api/v1/'+link+'/'+e, {
          headers: headers
        })
        .then(res => {
          this.thongbaoloi = res.data;
          this.ModalDelete = false;
          if(link == 'sanphamremove'){
            this.getAllProductsDaXoa();
          }
          if(link == 'hangsxremove'){
            this.getAllHangsxDaXoa();
          }
          if(link == 'timebaohanhremove'){
            this.getAllTimeBaoHanhDaXoa();
          }
        })
        .catch(err => {
          console.log(err);
        });
        this.fixedToasts++
    },
  }
}
</script>
<style scoped>
.fakeinput {padding: 0.46rem 0.8rem;display: inline-block;}
</style>