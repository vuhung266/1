<template>
  <CFooter :fixed="false">
    <div>
     <span class="ml-1">&copy; {{new Date().getFullYear()}}.</span>
    </div>
    <div class="mfs-auto">
      <span class="mr-1" target="_blank">Powered by</span>
      <a href="#1">quiz.edu.vn</a>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
