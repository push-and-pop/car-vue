<template>
    <div>

        <el-space wrap fill style="width: 100%" direction="vertical">
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <span>Hello! {{ name }}</span>
                        <!-- <el-button class="button" type="text">Operation button</el-button> -->
                    </div>
                </template>
                <div class="text item">目前的余额是：{{ money }}</div>
                <div class="text item">目前的车位有：{{ result.lenPark }}</div>
                <div class="text item">目前的公告是：{{ result.announce }}</div>
            </el-card>
        </el-space>
    </div>
</template>

<script setup>
import { getFrontPage } from "../api/api";
import { useStore } from "vuex";
import { computed, ref, onMounted, reactive } from "vue";
const store = useStore();
let name = store.state.userInfo.UserName;
let money = store.state.userInfo.Account
let result = reactive({
    lenPark: "",
    announce: ""
})
onMounted(() => {
    getFrontPage().then(res => {
        let data = res.data;
        result.lenPark = data.total_park,
            result.announce = data.announce,
            console.log(res)
    }).catch(e => {
        console.log(e)
    })
})
</script>

<style>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.box-card {
    width: 480px;
}
</style>
