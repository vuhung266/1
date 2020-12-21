<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-Layers" color="danger" /> Các trang nội dung
        <div class="card-header-actions">
          <CLink href="#" class="card-header-action btn-setting" @click="addnew">
            <CIcon name="cil-settings" />
          </CLink>
        </div>
      </CCardHeader>
      <CCardBody>
        <Table class="table table-bordered">
          <tr v-for="item in pages" :key="item.id">
            <td>
              <span class="fakeinput">
                {{item.name}} 
              </span>
            </td>
            <td style="width:100px; text-align:center">
              <CButton color="danger" variant="outline" size="sm" @click="deleteAsk(item.id)">
                <CIcon name="cil-XCircle" /> Xóa
              </CButton>
            </td>
            <td style="width:100px; text-align:center">
              <CButton color="primary" variant="outline" size="sm" @click="edit(item.id)">
                <CIcon name="cil-pencil" /> Sửa
              </CButton>
            </td>
          </tr>
        </Table>
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

    <CModal :title="titlemodal" :show.sync="myModal" size="lg">
      <CCardBody v-show="sua==true">
        <CRow>
          <CCol sm="12">
            <CInput label="Tiêu đề" v-model="dataedit.name"  />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <CTextarea
                label="Mô tả"
                v-model="dataedit.detail"
                rows="13"
                v-if="!xemtruoc"
              />
            <div v-html="dataedit.detail" v-if="xemtruoc"></div>  
          </CCol>
        </CRow>
      </CCardBody>
      <CCardBody v-show="sua-true">
        <CRow>
          <CCol sm="12">
            <CInput label="Tiêu đề" v-model="dataedit.name" placeholder="Nhập..." />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm="12">
            <CTextarea
                label="Nội dung"
                v-model="dataedit.detail"
                placeholder="Nhập nội dung"
                rows="13"
              />
          </CCol>
        </CRow>
      </CCardBody>
      <template #footer>
        <CButton @click="xemtruocedit()"  color="primary">{{textbtnxemtruoc}}</CButton>
        <CButton @click="myModal = false; getAllPages()" color="danger">Hủy</CButton>
        <CButton @click="senddata()" color="success" v-show="sua-true">Thêm mới</CButton>
        <CButton @click="sendEditData(dataedit.id)" color="success" v-show="sua==true">Lưu thông tin</CButton>
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
      Bạn có muốn xóa bản ghi: <b class="color-primary"> {{itemBiXoa.name}} </b>khỏi hệ thống?
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
export default {
  data () {
    return {
      titlemodal:'',
      myModal: false,
      pages: [],
      sua: false,
      dataedit: [],
      ketqua:[],
      fixedToasts: 0,
      thongbaoloi:[],
      ModalDelete: false,
      itemBiXoa:[],
      xemtruoc: false,
      textbtnxemtruoc: 'Xem trước'
    }
  },
  created: function () {
    this.getAllPages();
  },
  methods: {
    getAllPages: function(){
      axios.get('http://pintuanphuong.com.vn/api/v1/pages')
        .then(response => {
          this.pages = response.data.pages; 
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    addnew: function() {
      this.myModal= true;
      this.sua = false;
      this.titlemodal = 'Thêm thời gian bảo hành'; 
    },
    
    edit: function(e) {
      this.myModal= true;
      this.sua = true;
      this.titlemodal = 'Sửa nội dung';
      this.dataedit = this.getValuebyId(this.pages, e);  
    },
    
    getValuebyId (arr, value) {
      for (var i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i].id === value) {
          return arr[i];
        }
      }
    },

    senddata: function(){
      const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        const payload = {
          name: this.dataedit.name,
          detail: this.dataedit.detail,
        };

        //Send data with form url using querystring node package for it.
        axios
          .post('http://pintuanphuong.com.vn/api/v1/pages', qs.stringify(payload), {
            headers: headers
          })
          .then(res => {
            console.log(res.data);
            this.thongbaoloi = res.data;
            this.dataedit = [];
            this.getAllPages();
          })
          .catch(err => {
            console.log(err);
          });
          
          this.myModal = false;
          this.fixedToasts++;
          
    },

    sendEditData: function(e) {
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        const payload = {
          name: this.dataedit.name,
          detail: this.dataedit.detail,
        };

        //Send data with form url using querystring node package for it.
        axios
          .put('http://pintuanphuong.com.vn/api/v1/pages/'+e, qs.stringify(payload), {
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

    deleteAsk: function(e){
      this.ModalDelete = true;
      this.itemBiXoa = this.getValuebyId(this.pages, e);  
    },

    deleteitem: function(e) {
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        //Send data with form url using querystring node package for it.
        axios
          .delete('http://pintuanphuong.com.vn/api/v1/pages/'+e, {
            headers: headers
          })
          .then(res => {
            console.log(res.data);
            this.thongbaoloi = res.data;
            this.getAllPages();
            this.ModalDelete = false;
          })
          .catch(err => {
            console.log(err);
          });
          this.myModal = false;
          this.fixedToasts++
    },

    xemtruocedit: function(){
      this.xemtruoc = !this.xemtruoc;
      this.textbtnxemtruoc = this.xemtruoc ? 'Quay lại sửa nội dung' : 'Xem trước';
    }
  }
}
</script>
<style scoped>
.fakeinput {padding: 0.46rem 0.8rem;display: inline-block;}
</style>