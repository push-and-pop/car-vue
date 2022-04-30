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
            >Edit</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
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
import { getOrderList } from "../api/api.js";
let currentPage = ref(1);
let tableData = ref([]);
let total = ref(0);
function GetOrderList() {
  getOrderList({}).then().catch();
}
</script>

<style>
</style>