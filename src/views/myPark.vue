<template>
  <div>
    <el-space wrap fill style="width: 100%" direction="vertical">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>我的车位 {{ result.park }}</span>
            <!-- <el-button class="button" type="text">Operation button</el-button> -->
          </div>
        </template>
        <div v-show="show">
          <div class="text item">入库时间：{{ result.start }}</div>
          <div class="text item">需付金额：{{ result.price }}</div>
        </div>
      </el-card>
      <el-button :disabled="!show" type="primary" @click="LeavePark()"
        >出库</el-button
      >
    </el-space>
  </div>
</template>

<script setup>
import { getMyPark, postLeavePark } from "../api/api";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { computed, ref, onMounted, reactive } from "vue";
const store = useStore();
const router = useRouter();
let show = ref(false);
let result = reactive({
  park: "",
  start: "",
  price: "",
  location: "",
  number: 0,
});
let a = "a";
onMounted(() => {
  getMyPark()
    .then((res) => {
      if (res.park.ID != 0) {
        show.value = true;
        result.price = res.price.toString();
        result.start = formatDate(new Date(res.order.StartAt * 1000));
        result.location = res.park.Location;
        result.number = res.park.Number;
        result.park =
          res.park.Location + " " + res.park.Number.toString() + "号";
      } else {
        result.park = "暂未入库";
      }
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
});
const formatDate = (current_datetime) => {
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  return formatted_date;
};

function LeavePark() {
  postLeavePark({
    location: result.location,
    number: result.number,
  })
    .then((res) => {
      ElMessage({
        message: "出库成功",
        type: "success",
      });
      router.push("/order");
    })
    .catch((e) => {
      ElMessage({
        message: "出库失败",
        type: "error",
      });
      console.log(e);
    });
}
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