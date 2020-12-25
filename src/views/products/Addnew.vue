<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-Puzzle" color="danger" />
        Thêm sản phẩm
      </CCardHeader>
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
              <label>Ảnh đại diện</label>
              <input class="form-control" type="file" id="file" ref="file" v-on:change="onChangeFileUpload('procode')" style="padding:3px"/>
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
      <CCardFooter>
        <CButton @click="senddata()" class="float-right" size="sm" color="success"><CIcon name="cil-pencil"/> Thêm sản phẩm</CButton>
        <CButton @click="gotoUrl('/products/list')" class="float-right mr-2" size="sm" color="danger"><CIcon name="cil-XCircle"/> Hủy</CButton>
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
  data () {
    return {
      dataedit: [],
      fixedToasts: 0,
      thongbaoloi:[],
      loaisp:[{id:1, name: "Pin tiểu"},{id:2, name: "Pin Đũa"},{id:3, name: "Sạc pin"},],
      hangsx:[],
      timebaohanh:[],
    }
  },
  created: function () {
    axios.defaults.headers.common['Authorization'] = this.apiBimat;
    this.getAllTimeBaoHanh();
    this.getAllHangsx();
  },
  methods: {
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
    getFileExtension: function(e) {
        return e.split('.').pop();
    },
    onChangeFileUpload(e){
        this.file = this.$refs.file.files[0];
        var filetype = this.getFileExtension(this.file.name);
        var newname = e+'.'+filetype;
        console.log(newname);
    },

    senddata: function(){
        let formData = new FormData();
          if(this.file){
            var tenanh = this.file.name;
          }else{
            var tenanh = ''
          }
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
                  console.log('đẩy ảnh thành công');
                  this.dataedit.img = 'http://pintuanphuong.com.vn/public/products/'+tenanh;
                  console.log(this.dataedit.img);
                }else {
                  this.dataedit.img = '';
                  console.log('ko đẩy đc file');
                }
               
              })
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        const payload = {
          name:         this.dataedit.name,
          procode:      this.dataedit.procode,
          hangsx:       this.dataedit.hangsx,
          baohanh:      this.dataedit.baohanh,
          img:          this.dataedit.img,
          description:  this.dataedit.description,
        };

        axios
          .post('http://pintuanphuong.com.vn/api/v1/sanpham', qs.stringify(payload), {
            headers: headers
          })
          .then(res => {
            console.log(res.data);
            this.thongbaoloi = res.data;
            this.dataedit='';
            this.file = '';
          })
          this.fixedToasts++;
          
    },

    gotoUrl: function(e){
      this.$router.push({path: e}).catch(err => {});
    }
  }
}
</script>>