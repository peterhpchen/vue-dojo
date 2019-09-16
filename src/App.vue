<template>
  <div id="app">
    <header>
      <span class="vdj-title">
        Vue.js Dojo
      </span>
    </header>
    <main>
      <ThePlayground />
    </main>
    <!-- <footer>
      <span>MIT Licensed</span>
    </footer> -->
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
:root {
  --header-height: 60px;
  --footer-height: 60px;
}

html, body {
  height: 100vh;
  margin: 0;
}

body {
  overflow: hidden;
}

#app {
  height: 100vh;
}

header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

main {
  height: calc(100vh - var(--header-height));
  /* height: calc(100vh - var(--header-height) - var(--footer-height)); */
}

footer {
  height: var(--footer-height);
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
}

/* html {
  height: 100%;
}

body {
  min-height: 100%;
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
} */
</style>

<style scoped>
.vdj-title {
  margin-left: 10px;
  font-weight: bold;
}
</style>
