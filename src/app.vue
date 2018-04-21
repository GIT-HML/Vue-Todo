<template>
  <div id="app">
    <Header></Header>
    <todo></todo>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./layout/header.vue"
import Footer from "./layout/footer.jsx"
import todo from './views/todo/todo.vue'

export default {
  components: {
    Header,
    Footer,
    todo
  }
};
</script>

<style lang="stylus" scoped>
#app {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>

