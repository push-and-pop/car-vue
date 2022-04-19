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
        <el-table-column fixed prop="date" label="Date" width="150" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="state" label="State" width="120" />
        <el-table-column prop="city" label="City" width="320" />
        <el-table-column prop="address" label="Address" width="600" />
        <el-table-column prop="zip" label="Zip" width="120" />
      </el-table>
      <el-pagination
        :page-size="20"
        :pager-count="5"
        layout="prev, pager, next"
        :total="1000"
      />
    </el-space>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { postPubAnnouncement } from "../api/api";
const textarea = ref("");
const pubAnnouncement = () => {
  if (textarea.value === "") {
    return;
  }
  postPubAnnouncement({
    msg: textarea.value,
  })
    .then((res) => {
      let data = res.data.data;
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
      ElMessage.error("登录失败");
    });
};
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