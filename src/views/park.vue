<template>
  <el-space direction="vertical" fill>
    <div class="row">
      <el-select v-model="value1" class="m-2" placeholder="区域">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-select v-model="value2" class="m-2" placeholder="号位">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button @click="createPark()">创建车位</el-button>
    </div>
  </el-space>
  <div class="table">
    <el-table :data="filterTableData">
      <el-table-column label="创建时间" prop="date" />
      <el-table-column label="区域" prop="name" />
      <el-table-column label="号位" prop="name" />
      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="Type to search"
          />
        </template>
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
  </div>
</template>

<script  setup>
import { number } from "@intlify/core-base";
import { computed, ref } from "vue";
import { postCreatPark } from "../api/api";
import { ElMessage } from "element-plus";
const search = ref("");
const filterTableData = computed(() =>
  tableData.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
);
const handleEdit = (index, row) => {
  console.log(index, row);
};
const handleDelete = (index, row) => {
  console.log(index, row);
};
const value1 = ref("");
const options1 = [
  {
    value: "A区",
    label: "A区",
  },
  {
    value: "B区",
    label: "B区",
  },
  {
    value: "C区",
    label: "C区",
  },
  {
    value: "D区",
    label: "D区",
  },
];
const value2 = ref(null);
const options2 = [
  {
    value: 1,
    label: "1号",
  },
  {
    value: 2,
    label: "2号",
  },
  {
    value: 3,
    label: "3号",
  },
  {
    value: 4,
    label: "4号",
  },
];

function createPark() {
  if (value1.value === "" || value2.value === null) {
    return;
  }
  postCreatPark({
    location: value1.value,
    number: value2.value,
  })
    .then((res) => {
      let data = res.data;
      if (data.status === 200) {
        ElMessage({
          message: "创建成功",
          type: "success",
        });
        console.log(res);
      }
    })
    .catch((e) => {
      ElMessage({
        message: "创建失败" + e,
        type: "error",
      });
      console.log(e);
    });
}
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "John",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Morgan",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Jessy",
    address: "No. 189, Grove St, Los Angeles",
  },
];
</script>


<style>
.table {
}
.row {
  width: 100%;
}
</style>