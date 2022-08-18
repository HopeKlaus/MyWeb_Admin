<template>
  <a :title="title">
    <el-button v-bind="$attrs"
               v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  props: ['title'],
  name: 'HintButton'
}
</script>

<style>
</style>