<template>
  <router-view />
</template>

<script setup>
import { useStore } from "vuex";

const store = useStore();
//在页面加载时读取sessionStorage里的状态信息
if (sessionStorage.getItem("store")) {
  store.replaceState(
    Object.assign(
      {},
      store.state,
      JSON.parse(sessionStorage.getItem("store"))
    )
  );
}

//在页面刷新时将vuex里的信息保存到sessionStorage里
window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("store", JSON.stringify(store.state));
});


</script>

<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css";
</style>
