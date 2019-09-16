<template>
  <div>
    <div
      v-for="(propValue, name) in propDefine"
      :key="propValue"
    >
      {{ name }} : <input
        type="text"
        :value="propValue.default"
        @input="$emit('input', {...value, [name]: $event.target.value})"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    propDefine: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style>

</style>
