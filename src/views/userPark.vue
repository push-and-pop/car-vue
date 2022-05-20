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
          <!-- <el-button
            size="small"
            type="primary"
            @click="LeavePark(scope.$index, scope.row)"
            >出库</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <el-space wrap fill style="width: 100%" direction="vertical">
      <el-pagination
        :page-size="5"
        :pager-count="5"
        @current-change="consolePage()"
        v-model:current-page="currentPage"
        layout="prev, pager, next"
        v-model:total="total"
      />
    </el-space>
    <el-dialog v-model="dialogFormVisible" title="预定车位">
      <div class="block">
        <el-space wrap fill style="width: 100%" direction="vertical">
          <span class="demonstration">选择时间段:预约一天后的时间段</span>
          <el-date-picker
            v-model="timeInterval"
            type="datetimerange"
            :editable="false"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :disabledDate="JudgeTime"
          />

          <el-input v-model="price" disabled placeholder="价格"
            ><template #prepend>预计价格</template>
          </el-input>
          <!-- <el-form :model="form">
            <el-form-item label="Promotion name" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Zones" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="Please select a zone">
                <el-option label="Zone No.1" value="shanghai" />
                <el-option label="Zone No.2" value="beijing" />
            </el-select>
            </el-form-item>
        </el-form> -->
        </el-space>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="ReservePark()">预约</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  getParkList,
  postEnterPark,
  postReservePark,
  postLeavePark,
} from "../api/api";
import { computed, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
let currentPage = ref(1);
let tableData = ref([]);
let total = ref(0);
let dialogFormVisible = ref(false);
let chooseLocation = ref("");
let chooseNumber = ref(0);
let timeInterval = ref([]);
let store = useStore();

let price = computed(() => {
  if (timeInterval.value.length === 2) {
    console.log(
      timeInterval.value[0].getTime(),
      timeInterval.value[1].getTime()
    );
    return Math.ceil(
      ((timeInterval.value[1].getTime() - timeInterval.value[0].getTime()) /
        1000 /
        3600) *
        3
    );
  }
  return 0;
});
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
function EnterPark(index, row) {
  console.log(row.Location, row.Number);
  postEnterPark({
    location: row.Location,
    number: row.Number,
  })
    .then((res) => {
      let data = res.data;

      ElMessage({
        message: "入库成功",
        type: "success",
      });
      row.ParkState = "使用中";
      console.log(res);
      store.commit("enterPark", row.ID);
    })
    .catch((e) => {
      ElMessage({
        message: "入库失败" + e,
        type: "error",
      });
    });
}

function LeavePark(index, row) {
  postLeavePark({
    location: row.Location,
    number: row.Number,
  })
    .then((res) => {
      ElMessage({
        message: "出库成功",
        type: "success",
      });
      row.ParkState = "开放中";
    })
    .catch((e) => {
      ElMessage({
        message: "出库失败",
        type: "error",
      });
      console.log(e);
    });
}

function handleEdit(index, row) {
  dialogFormVisible.value = true;
  chooseLocation.value = row.Location;
  chooseNumber.value = row.Number;
}
function JudgeTime(date) {
  5;
  return date.getTime() < Date.now();
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
function ReservePark() {
  if (timeInterval.value.length != 2) {
    ElMessage({
      message: "请选择时间段",
      type: "error",
    });
  }
  postReservePark({
    location: chooseLocation.value,
    number: chooseNumber.value,
    start_time: timeInterval.value[0].getTime() / 1000,
    end_time: timeInterval.value[1].getTime() / 1000,
  })
    .then((res) => {
      ElMessage({
        message: "预定成功",
        type: "success",
      });
      dialogFormVisible.value = false;
    })
    .catch((e) => {
      console.log(e.response.data.err);
      ElMessage({
        message: "预定失败",
        type: "error",
      });
      dialogFormVisible.value = false;
    });
}
</script>

<style>
</style>