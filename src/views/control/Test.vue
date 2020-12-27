<template>
    <div>
        <label>First Name</label>
        <input type="text" v-model="form.name"/>

        <label>Last Name</label>
        <input type="text" v-model="form.mota"/>

        <label>Email</label>
        <input type="text" v-model="form.email"/>

        <button v-on:click="submit()">Submit</button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return {
            form: {
                name: '',
                mota: '',
                email: ''
            }
        }
    },

    methods: {
        submit(){
            axios.put('http://pintuanphuong.com.vn/api/v1/timebaohanh/1', this.form)
                .then(function( response ){
                   console.log(response);
                }.bind(this));
        }
    }
}
</script>