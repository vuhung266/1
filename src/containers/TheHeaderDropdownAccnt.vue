<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img 
            :src="userAvatar"
            class="c-avatar-img"
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader class="bg-light"><h6 class="mb-0" v-if="userdata">{{userdata.name}}</h6></CDropdownHeader>
    <CDropdownItem @click="gotoUrl('/control/thongtincanhan')">
      <CIcon name="cil-user" /> Thông tin cá nhân
    </CDropdownItem>
    <CDropdownItem @click="logout();">
      <CIcon name="cil-lock-locked" /> Thoát
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import axios from 'axios';
export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return { 
      userAvatar:'',
      itemsCount: 42,
      userdata:[],
    }
  },
  created: function () {
    this.userdata = $cookies.get('user_data'); 
    axios.defaults.headers.common['Authorization'] = this.apiBimat;
    this.userAvatar = window.localStorage.avatar;
  },
  methods: {
    logout: function(){
      window.localStorage.auth = false;
      localStorage.removeItem('userAuth')
      this.$router.push({path: '/pages/login'});
      
    },
    gotoUrl: function(e){
      this.$router.push({path: e}).catch(err => {});
    },
    getUserInfo: function(e){
      axios.get('http://pintuanphuong.com.vn/api/v1/getuserinfo/'+e)
        .then(response => {
          this.userInfo = response.data;
      })  
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>