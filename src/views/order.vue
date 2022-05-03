<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column label="ID" prop="ID" />
      <el-table-column label="开始时间" prop="StartAt" />
      <el-table-column label="类型" prop="Type" />
      <el-table-column label="状态" prop="State" />
      <el-table-column label="价格" prop="Price" />
      <el-table-column align="right">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            :disabled="scope.row.State != '未支付'"
            @click="handlePay(scope.$index, scope.row)"
            >支付</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-space wrap fill style="width: 100%" direction="vertical"
      ><el-pagination
        :page-size="5"
        :pager-count="5"
        @current-change="consolePage()"
        v-model:current-page="currentPage"
        layout="prev, pager, next"
        v-model:total="total"
    /></el-space>
  </div>
</template>

<script setup>
import { getOrderList, postPayPark } from "../api/api.js";
import { computed, ref, onMounted } from "vue";
let currentPage = ref(1);
let tableData = ref([]);
let total = ref(0);
let Disabled = computed(() => {
  return false;
});
function GetOrderList() {
  getOrderList({
    offset: currentPage.value - 1,
    limit: 5,
  })
    .then((res) => {
      let data = res.data;
      console.log(res);
      total.value = data.total;
      tableData.value = [];
      data.order.forEach((element) => {
        tableData.value.push({
          ID: element.ID,
          StartAt: formatDate(new Date(element.StartAt * 1000)),
          State: ConvertState(element.State),
          Type: ConvertType(element.Type),
          Price: ConvertPrice(element.Price),
        });
      });
    })
    .catch((e) => {
      console.log(e);
    });
}
onMounted(() => {
  GetOrderList();
});
function ConvertType(type) {
  switch (type) {
    case 1:
      return "持续订单";
    case 2:
      return "完整订单";
  }
}
function ConvertState(state) {
  switch (state) {
    case 1:
      return "进行中";
    case 2:
      return "未支付";
    case 3:
      return "已支付";
  }
}
function ConvertPrice(price) {
  switch (price) {
    case 0:
      return "出库后订单完成";
    default:
      return price;
  }
}

function handlePay(index, row) {
  postPayPark({
    ID: row.ID,
  })
    .then((res) => {
      ElMessage({
        message: "支付成功",
        type: "success",
      });
      row.State = "已支付";
    })
    .catch((e) => {
      console.log(e);
    });
}

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
</script>

<style>
</style>