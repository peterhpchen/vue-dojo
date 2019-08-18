<template>
  <div id="app">
    <ThePlayground />
  </div>
</template>

<script>
import ThePlayground from './components/ThePlayground.vue';

export default {
  name: 'App',
  components: {
    ThePlayground,
  },
};
</script>

<style>
html {
  height: 100%;
}

body {
  min-height: 100%;
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
}
</style>
