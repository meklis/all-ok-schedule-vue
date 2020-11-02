<template>
  <div id="app">
    <MyCalendar/>
  </div>
</template>

<script>
import MyCalendar from './components/MyCalendar.vue'

export default {
  name: 'App',
  components: {
   MyCalendar,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
