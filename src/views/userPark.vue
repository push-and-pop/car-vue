<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column label="ID" prop="ID" />
      <el-table-column label="区域" prop="Location" />
      <el-table-column label="号位" prop="Number" />
      <el-table-column label="状态" prop="ParkState" />
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >预约</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="EnterPark(scope.$index, scope.row)"
            >入库</el-button
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
import { getParkList, postEnterPark } from "../api/api";
import { computed, ref, onMounted } from "vue";
let currentPage = ref(1);
let tableData = ref([]);
let total = ref(0);
function GetParkList() {
  getParkList({
    offset: currentPage.value - 1,
    limit: 5,
  })
    .then((res) => {
      let data = res.data;
      console.log(res);
      total.value = data.total;
      tableData.value = [];
      data.park.forEach((element) => {
        tableData.value.push({
          ID: element.ID,
          Location: element.Location,
          Number: element.Number,
          ParkState: ConvertParkState(element.ParkState),
        });
      });
    })
    .catch((e) => {
      console.log(e);
    });
}
onMounted(() => {
  GetParkList();
});
function consolePage() {
  GetParkList();
}
function ConvertParkState(state) {
  switch (state) {
    case 1:
      return "开放中";
    case 2:
      return "使用中";
  }
}
let a;
function EnterPark(index, row) {
  console.log(row.Location, row.Number);
  postEnterPark({
    location: row.Location,
    number: row.Number,
  })
    .then((res) => {
      let data = res.data;
      if (data.status === 200) {
        ElMessage({
          message: "入库",
          type: "success",
        });
        console.log(res);
      }
    })
    .catch((e) => {
      ElMessage({
        message: "入库失败" + e,
        type: "error",
      });
    });
}
</script>

<style>
</style>