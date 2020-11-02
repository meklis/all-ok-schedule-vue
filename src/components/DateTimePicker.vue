<template>
    <div class='input-group date' ref="datetimepicker">
        <input type='text' class="form-control" :value="valueFormated" @change="update($event)" />
        <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                </span>
    </div>
</template>

<script>
    import $ from 'jquery';
    import 'eonasdan-bootstrap-datetimepicker';
    import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'
    import moment from 'moment';
    export default  {
        props: ['value', 'pickTime'],
        methods: {
            update(event){
                console.log(event.target.value);
                let date = moment(event.target.value, "DD.MM.YYYY HH:mm");
                console.log(date);
                this.$emit('input', date);
            }
        },
        computed: {
          valueFormated() {
            return moment(this.value).format("DD.MM.YYYY HH:mm")
          },
        },
        mounted(){
            console.log(this.value)
            let props = {locale: 'ru',  defaultDate: this.value}
            if(!this.pickTime) {
               props.format = 'LT'
            }
            props.date = this.value
            $(this.$refs.datetimepicker).datetimepicker(props)
            $(this.$refs.datetimepicker).on('dp.change', e => { this.$emit('input', new Date(e.date));})
        }
    }
</script>

<style scoped>
 .date {
     border: 0px solid black;

 }
 .form-control {
     height: 40px !important;
 }
</style>