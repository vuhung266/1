<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-basket" /> Hãng sản xuất
        <div class="card-header-actions">
          <CLink href="#" class="card-header-action btn-setting" @click="addnew">
            <CIcon name="cil-settings" />
          </CLink>
        </div>
      </CCardHeader>
      <CCardBody>
        <Table class="table table-bordered">
          <tr v-for="item in hangsx" :key="item.id">
            <td>
              <span class="fakeinput" v-if="item.edit == false">
                {{item.name}} 
              </span>
              <span v-if="item.edit == true" class="d-flex">
                <CInput  class="mb-0" v-model="dataEdit.name" />
                <CButton color="success" size="sm" @click="item.edit = false; sendEditData(item.id)" class="ml-2">
                  <CIcon name="cil-check" /> Lưu
                </CButton>
              </span>
            </td>
            <td style="width:150px">
               <CButton color="danger" variant="outline" size="sm" @click="deleteAsk(item.id);" :disabled="disabled" class="mr-2">
                <CIcon name="cil-XCircle" /> Xóa
              </CButton>
              <CButton color="primary" variant="outline" v-show="item.edit == false" size="sm" :disabled="disabled" @click="item.edit = true; edit(item.id); disabled = !disabled">
                <CIcon name="cil-pencil" /> Sửa
              </CButton>
              <CButton color="danger" v-show="item.edit == true" size="sm"  @click="item.edit = false; disabled =false; resetval(item.id)">
                  <CIcon name="cil-XCircle"  size="sm" /> Hủy
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
      <CCardBody>
        <CRow>
          <CCol sm="12">
            <CInput label="Tên hãng sản xuất" v-model="dataEdit.name" placeholder="Nhập tên hãng sản xuất" />
          </CCol>
        </CRow>
      </CCardBody>
      <template #footer>
        <CButton @click="myModal = false" color="danger">Hủy</CButton>
        <CButton @click="senddata()" color="success">Xác nhận</CButton>
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
      hangsx: [],
      dataEdit: [],
      disabled: false,
      fixedToasts: 0,
      thongbaoloi:[],
      ModalDelete: false,
      itemBiXoa:[],
    }
  },
  created: function () {
    if(this.apiBimat == undefined){
      console.log('Không lấy đc mã bí mật')
    }else{
      axios.defaults.headers.common['Authorization'] = this.apiBimat;
      this.getAllHangsx();
      
    }
  },
  methods: {
    getAllHangsx: function(){
      axios.get('http://pintuanphuong.com.vn/api/v1/hangsx')
        .then(response => {
          this.hangsx = response.data.hangsx;// console.log(this.hangsx);
        })
    },
    addnew: function() {
      this.myModal= true;
      this.titlemodal = 'Thêm hãng sản xuất'
    },
    edit: function(e) {
      this.dataEdit = this.getValuebyId(this.hangsx, e);  //console.log(this.dataEdit.name);
    },
    resetval: function(){
      this.getAllHangsx();
    },
    getValuebyId (arr, value) {
      for (var i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i].id === value) {
          return arr[i];
        }
      }
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
            this.disabled= false;
          })
          .catch(err => {
            console.log(err);
          });
          this.myModal = false;
          this.fixedToasts++
    },

    deleteAsk: function(e){
      this.ModalDelete = true;
      this.itemBiXoa = this.getValuebyId(this.hangsx, e);  
    },

    deleteitem: function(e) {
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        axios
          .delete('http://pintuanphuong.com.vn/api/v1/hangsx/'+e, {
            headers: headers
          })
          .then(res => {
            console.log(res.data);
            this.thongbaoloi = res.data;
            this.getAllHangsx();
            this.ModalDelete = false;
          })
          .catch(err => {
            console.log(err);
          });
          this.myModal = false;
          this.fixedToasts++
    },

    senddata: function(){
      const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        const payload = {
          name: this.dataEdit.name,
        };

        //Send data with form url using querystring node package for it.
        axios
          .post('http://pintuanphuong.com.vn/api/v1/hangsx', qs.stringify(payload), {
            headers: headers
          })
          .then(res => {
            console.log(res.data);
            this.thongbaoloi = res.data;
            this.dataedit = [];
            this.getAllHangsx();
          })
          .catch(err => {
            console.log(err);
          });
          
          this.myModal = false;
          this.fixedToasts++;
          
    },
    
  }
}
</script>
<style scoped>
.fakeinput {padding: 0.46rem 0.8rem;display: inline-block;}
</style>