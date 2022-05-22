<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column label="ID" prop="ID" />
      <el-table-column label="账号" prop="UserName" />
      <el-table-column label="真实姓名" prop="Name" />
      <el-table-column label="车牌号" prop="CarNumber" />
      <el-table-column label="账户余额" prop="Account" />
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button
            size="small"
            type="primary"
            :disabled="store.state.userInfo.ID == scope.row.ID"
            @click="DelteUser(scope.$index, scope.row)"
            >删除</el-button
          >
          <!-- <el-button
            size="small"
            type="primary"
            :disabled="store.state.userInfo.ID == scope.row.ID"
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
    <el-dialog v-model="dialogFormVisible" title="用户修改">
      <div class="block">
        <el-space wrap fill style="width: 100%" direction="vertical">
          <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>账户编辑</span>
            </div>
          </template>
          <el-form
            :model="form"
            :rules="rules"
            ref="message"
            label-width="100px"
            style="max-width: 400px"
          >
            <el-form-item label="用户名： "> {{ name }} </el-form-item>
            <el-form-item label="手机号码:" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名：" prop="trueName">
              <el-input v-model="form.trueName"></el-input>
            </el-form-item>
            <el-form-item label="身份证：" prop="idCard">
              <el-input v-model="form.idCard"></el-input>
            </el-form-item>
            <el-form-item label="车牌号：" prop="carNumber">
              <el-input v-model="form.carNumber"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
        </el-space>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateUser()">修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  getUser,delUser,updateUser,
} from "../api/api";
import { computed, ref, onMounted ,reactive } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
let userdata;
let currentPage = ref(1);
let tableData = ref([]);
let total = ref(0);
let store = useStore();
let dialogFormVisible = ref(false);
const message = ref(null);
const form = reactive({
  phone: "",
  trueName: "",
  idCard: "",
  carNumber: "",
});


function GetUserList(){
  getUser({ 
    offset: currentPage.value - 1,
    limit: 5,
    }).then((res) => {
     // console.log(store.state.userInfo)
      let data = res.data;
       total.value = data.total;
      tableData.value = [];
      userdata = data.user;
      data.user.forEach((element) => {
        tableData.value.push({
          ID: element.ID,
          UserName: element.UserName,
          CarNumber: element.CarNumber,
          Account:element.Account,
          Name:element.Name,
        });
      });
      }
    ).catch((e) => {
      console.log(e);})
}
onMounted(() =>{
  GetUserList()
})
function DelteUser(index, row){
  delUser({
    id:row.ID,
  }).then(res =>{
       ElMessage({
        message: "删除成功",
        type: "success",
      });
      GetUserList()
  }
  ).catch(e =>{
    ElMessage({
        message: "删除失败" + e,
        type: "error",
      });
  })
}

function handleEdit(index,row){
  dialogFormVisible.value = true;
  form.phone = userdata[index].Phone;
  form.trueName = userdata[index].Name;
  form.idCard = userdata[index].IdCard;
  form.carNumber = userdata[index].CarNumber;
}

function handleUpdateUser(){
  updateUser({
    phone: form.phone,
    trueName: form.trueName,
    idCard: form.idCard,
    carNumber: form.carNumber,
  }).then(res =>{
       ElMessage.success("修改成功");
  }).catch(e =>{
        ElMessage({
        message: "修改失败",
        type: "error",
      });
  })
}


let checkIdentitytionId = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("身份证号不能为空"));
  }
  if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
    callback(new Error("你输入的身份证长度或格式错误"));
  }
  //身份证城市
  var aCity = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外",
  };
  if (!aCity[parseInt(value.substr(0, 2))]) {
    callback(new Error("你的身份证地区非法"));
  }
  // 出生日期验证
  var sBirthday = (
      value.substr(6, 4) +
      "-" +
      Number(value.substr(10, 2)) +
      "-" +
      Number(value.substr(12, 2))
    ).replace(/-/g, "/"),
    d = new Date(sBirthday);
  if (
    sBirthday !=
    d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
  ) {
    callback(new Error("身份证上的出生日期非法"));
  }

  // 身份证号码校验
  var sum = 0,
    weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
    codes = "10X98765432";
  for (var i = 0; i < value.length - 1; i++) {
    sum += value[i] * weights[i];
  }
  var last = codes[sum % 11]; //计算出来的最后一位身份证号码
  if (value[value.length - 1] != last) {
    callback(new Error("你输入的身份证号非法"));
  }
  callback();
};
let rulescontactTelephone = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("不允许为空"));
  } else {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(value)) {
      callback(new Error("手机号格式不正确"));
    } else {
      callback();
    }
  }
};
const checkName = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入中文名"));
  } else {
    const reg = /^[\u4e00-\u9fa5]+$/;

    if (value.length < 100 && reg.test(value)) {
      callback();
    } else {
      return callback(new Error("请输入正确的中文名"));
    }
  }
};

function isVehicleNumber(vehicleNumber) {
  var xreg =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
  var creg =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
  if (vehicleNumber.length == 7) {
    return creg.test(vehicleNumber);
  } else if (vehicleNumber.length == 8) {
    return xreg.test(vehicleNumber);
  } else {
    return false;
  }
}
let vehicleNumber = (rule, value, callback) => {
  if (isVehicleNumber(value)) {
    callback();
  } else {
    return callback(new Error("车牌号不正确"));
  }
};

const rules = {
  phone: [
    {
      required: true,
      message: "请输入手机号码",
      trigger: "blur",
    },
    { trigger: "blur", validator: rulescontactTelephone },
  ],
  trueName: [
    { required: true, message: "请输入真实姓名", trigger: "blur" },
    { trigger: "blur", validator: checkName },
  ],
  idCard: [
    { required: true, message: "请输入身份证号码", trigger: "blur" },
    { validator: checkIdentitytionId, trigger: "blur" },
  ],
  carNumber: [
    { required: true, message: "请输入车牌号", trigger: "blur" },
    { validator: vehicleNumber, trigger: "blur" },
  ],
};
</script>

<style>

</style>