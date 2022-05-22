<template>
  <div>
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
      <el-table :data="tableData" border>
        <el-table-column label="ID" prop="ID" />
        <el-table-column label="区域" prop="Location" />
        <el-table-column label="号位" prop="Number" />
        <el-table-column label="状态" prop="ParkState" />
        <el-table-column align="right">
          <template #default="scope">
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
  </div>
</template>

<script  setup>
import { number } from "@intlify/core-base";
import { computed, ref, onMounted } from "vue";
import { postCreatPark } from "../api/api";
import { ElMessage } from "element-plus";
import { getParkList, delPark } from "../api/api";

// const filterTableData = computed(() =>
//   tableData.filter(
//     (data) =>
//       !search.value ||
//       data.name.toLowerCase().includes(search.value.toLowerCase())
//   )
// );
const handleEdit = (index, row) => {
  console.log(index, row);
};
const handleDelete = (index, row) => {
  console.log(index, row);
  delPark({
    id:row.ID,
  }).then(res =>{
      ElMessage({
          message: "删除成功",
          type: "success",
        });
        parkList();
  }).catch(e =>{
      ElMessage({
        message: "删除失败" + e,
        type: "error",
      });
  })  
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
      parkList();
    })
    .catch((e) => {
      ElMessage({
        message: "创建失败" + e,
        type: "error",
      });
      console.log(e);
    });
}
let currentPage = ref(1);
let tableData = ref([]);
let total = ref(0);
function parkList() {
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
  parkList();
});
function consolePage() {
  parkList();
}

function ConvertParkState(state) {
  switch (state) {
    case 1:
      return "开放中";
    case 2:
      return "使用中";
  }
}
</script>


<style>
.table {
}
.row {
  width: 100%;
}
</style>