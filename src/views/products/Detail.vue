<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-Puzzle" color="danger" />
        Chi tiết sản phẩm:
      </CCardHeader>
      <CCardBody>
        <CRow class="form-group">
          <CCol sm="12" md="3" >
           <span class="fakeinput">Tên sản phẩm</span>
          </CCol>
          <CCol sm="12" md="9">
            <span class="fakeinput" v-if="edit == false">
                {{ChiTietSanPham.name}}
            </span>
            <span v-if="edit==true">
                <CInput class="mb-0"  v-model="ChiTietSanPham.name" />
            </span>
          </CCol>
        </CRow>
        <CRow class="form-group">
          <CCol sm="12" md="3">
           <span class="fakeinput">Mã sản phẩm</span>
          </CCol>
          <CCol sm="12" md="9">
          <span class="fakeinput" v-if="edit == false">
           {{ChiTietSanPham.procode}}
          </span>
           <span v-if="edit==true">
                <CInput class="mb-0" v-model="ChiTietSanPham.procode" />
            </span>
          </CCol>
        </CRow>
        <CRow class="form-group">
          <CCol sm="12" md="3">
           <span class="fakeinput">Hãng sản xuất</span>
          </CCol>
          <CCol sm="12" md="9">
          <span class="fakeinput" v-if="edit == false">
           {{ChiTietSanPham.hangsanxuat}}
          </span>
           <span v-if="edit==true">
                <select class="form-control" v-model="ChiTietSanPham.hangsx">
                  <option v-for="item in hangsx" :key="item.id" :value="item.id" >
                    {{item.name}}
                  </option>
                </select>
            </span>
          </CCol>
        </CRow>
        <CRow class="form-group">
          <CCol sm="12" md="3">
           <span class="fakeinput">Thời gian bảo hành</span>
          </CCol>
          <CCol sm="12" md="9">
            <span class="fakeinput" v-if="edit == false">
                {{ChiTietSanPham.thoigianbaohanh}}
            </span>
            <span v-if="edit==true">
              <select class="form-control" v-model="ChiTietSanPham.baohanh">
                  <option v-for="item in timebaohanh" :key="item.id" :value="item.id" >
                   {{item.name}}
                  </option>
              </select>
            </span>
          </CCol>
        </CRow>
        <CRow class="form-group">
          <CCol sm="12" md="3">
           <span class="fakeinput">Mô tả chi tiết</span>
          </CCol>
          <CCol sm="12" md="9">
          <div class="fakeinput" v-html="ChiTietSanPham.description" v-if="edit == false"></div>
           <span v-if="edit==true">
              <CTextarea
                    v-model="ChiTietSanPham.description"
                    placeholder="Nhập mô tả"
                    rows="3"
                    width="100%"
              />
            </span>
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter>
        <CButton @click="backbutton()" size="sm" color="secondary"><CIcon name="cil-ChevronLeft"/> Quay lại</CButton>
        <CButton @click="editPro()"  v-if="edit==false" class="float-right" size="sm" color="primary" variant="outline"><CIcon name="cil-pencil"/> Sửa</CButton>
        <CButton @click="sendEditData()" v-if="edit==true" class="float-right" size="sm" color="success"><CIcon name="cil-pencil"/> Lưu</CButton>
        <CButton @click="CancelEdit()" v-if="edit==true" class="float-right mr-2" size="sm" color="danger"><CIcon name="cil-XCircle"/> Hủy</CButton>
      </CCardFooter>
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
  </div>
</template>
<script>
import axios from 'axios';
const qs = require('querystring');
export default {
  data(){
    return {
      edit:false,
      ChiTietSanPham:[],
      dataEdit:[],
      timebaohanh:[],
      hangsx:[],
      fixedToasts: 0,
      thongbaoloi:[],
    }
  },
  created: function(){
    axios.defaults.headers.common['Authorization'] = this.apiBimat;
    this.getDetailProduct();
    this.getAllTimeBaoHanh();
    this.getAllHangsx();
  },
  methods: {
    getDetailProduct: function () {
      axios.get("http://pintuanphuong.com.vn/api/v1/sanpham/" + this.$route.params.id)
        .then(response => {
          this.ChiTietSanPham = response.data;
        })
        .catch(e => {
          this.errors.push(e)
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
    backbutton: function () {
      this.$router.go(-1);
    },
    sendEditData: function() {
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        const payload = {
          name: this.ChiTietSanPham.name,
          procode: this.ChiTietSanPham.procode,
          hangsx: this.ChiTietSanPham.hangsx,
          baohanh: this.ChiTietSanPham.baohanh,
          description: this.ChiTietSanPham.description,
        };

        //Send data with form url using querystring node package for it.
        axios
          .put('http://pintuanphuong.com.vn/api/v1/sanpham/'+this.$route.params.id, qs.stringify(payload), {
            headers: headers
          })
          .then(res => {
            this.thongbaoloi = res.data;
            this.getDetailProduct();
            this.edit=false;
          })
          .catch(err => {
            console.log(err);
          });
          
          this.myModal = false;
          this.fixedToasts++
    },
    editPro: function () {
      this.edit=true;
    },
    CancelEdit: function () {
      this.edit=false;
      this.getDetailProduct();
    }
  }
}
</script>
<style scoped>
.fakeinput {padding: 0.46rem 0.8rem;display: inline-block;}
</style>