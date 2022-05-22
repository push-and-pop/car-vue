<template>
  <div>
    <el-space wrap fill style="width: 100%" direction="vertical">
      <el-input
        v-model="textarea"
        :autosize="{ minRows: 8, maxRows: 8 }"
        class="inputarea"
        type="textarea"
        placeholder="输入新公告"
      />
      <el-button type="primary" @click="pubAnnouncement()">发布</el-button>
      <el-table :data="tableData" style="width: 100%" height="250">
        <el-table-column fixed prop="date" label="Date" width="250" />
        <el-table-column prop="msg" label="Msg" width="250" />
      </el-table>
      <el-pagination
        :page-size="5"
        :pager-count="5"
        @current-change="consolePage()"
        v-model:current-page="currentPage"
        layout="prev, pager, next"
        v-model:total="total"
      />
    </el-space>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { postPubAnnouncement, getAnnouncement } from "../api/api";
const textarea = ref("");
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
let currentPage = ref(1);
let total = ref(0);
let tableData = ref([]);
const pubAnnouncement = () => {
  if (textarea.value === "") {
    return;
  }
  postPubAnnouncement({
    msg: textarea.value,
  })
    .then((res) => {
      let data = res.data;
      textarea.value = "";
      GetAnnouncement();
    })
    .catch((e) => {
      console.log(e);
      ElMessage.error("登录失败");
    });
};

function GetAnnouncement() {
  getAnnouncement({
    offset: currentPage.value - 1,
    limit: 5,
  })
    .then((res) => {
      let data = res.data;
      console.log(res);
      total.value = data.total;
      tableData.value = [];
      data.announcement.forEach((element) => {
        tableData.value.push({
          msg: element.msg,
          date: formatDate(new Date(element.date* 1000)),
        });
      });
      console.log(tableData);
    })
    .catch((e) => {
      console.log(e);
    });
}
onMounted(() => {
  GetAnnouncement();
});
function consolePage() {
  GetAnnouncement();
}
</script>

<style  scoped>
.inputarea {
  width: 800px;
}

.el-row {
  height: 170px;
  display: flex;
}
.el-row2 {
  height: 60px;
  display: flex;
}
.input {
  height: 30%;
  width: 100%;
}
.table {
  height: 70%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>