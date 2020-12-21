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
            src="img/avatars/6.jpg"
            class="c-avatar-img "
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
import VueCookies from 'vue-cookies';
export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return { 
      itemsCount: 42,
      userdata:[]
    }
  },
  created: function () {
    this.userdata = $cookies.get('user_data');
    if (!this.userdata) {
      this.$router.push({path: '/pages/login'});
    }
  },
  methods: {
    logout: function(){
      window.localStorage.auth = false;
      $cookies.remove('user_data')
      this.$router.push({path: '/pages/login'});
    },
    gotoUrl: function(e){
      this.$router.push({path: e}).catch(err => {});
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>