<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>基础信息</span>
            </div>
          </template>
          <div class="info">
            <div class="info-image" @click="showDialog">
              <img :src="avatarImg" />
              <span class="info-edit">
                <i class="el-icon-lx-camerafill"></i>
              </span>
            </div>
            <div class="info-name">{{ name }}</div>
            <div class="info-desc">第一次登录，请先完善信息吧！</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>账户编辑</span>
            </div>
          </template>
          <el-form :model="form" :rules="rules" ref="message" label-width="100px" style="max-width: 400px">
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
            <el-form-item>
              <el-button type="primary" @click="onSubmit">上传</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
      <vue-cropper ref="cropper" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
        style="width: 100%; height: 400px"></vue-cropper>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="crop-demo-btn" type="primary">选择图片
            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
          </el-button>
          <el-button type="primary" @click="saveAvatar">上传并保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import avatar from "../assets/img/img.jpg";
import { useStore } from "vuex";
import { postUploadMessage } from "../api/api.js";
import { ElMessage } from "element-plus";

const store = useStore();
const name = store.state.userInfo.UserName;
const form = reactive({
  phone: "",
  trueName: "",
  idCard: "",
  carNumber: "",
});
const message = ref(null);
const onSubmit = () => {
  message.value.validate(valid => {
    if (valid) {
      postUploadMessage({
        phone: form.phone,
        trueName: form.trueName,
        idCard: form.idCard,
        carNumber: form.carNumber,
      }).then(res => {
        ElMessage.success("上传成功");
        let data = res.data;
        store.commit("setUserInfo", data.user_info);
        localStorage.setItem("car_IsComplet", "true")
        router.push("/");
      }).catch(e => {
        ElMessage.success("上传失败");
      })
    } else {
      return false;
    }
  })
};

const avatarImg = ref(avatar);
const imgSrc = ref("");
const cropImg = ref("");
const dialogVisible = ref(false);
const cropper = ref(null);

const showDialog = () => {
  dialogVisible.value = true;
  imgSrc.value = avatarImg.value;
};

const setImage = (e) => {
  const file = e.target.files[0];
  if (!file.type.includes("image/")) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    dialogVisible.value = true;
    imgSrc.value = event.target.result;
    cropper.value && cropper.value.replace(event.target.result);
  };
  reader.readAsDataURL(file);
};

const cropImage = () => {
  cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
};

const saveAvatar = () => {
  avatarImg.value = cropImg.value;
  dialogVisible.value = false;
};
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
    91: "国外"
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
    callback(new Error('不允许为空'))
  } else {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(value)) {
      callback(new Error('手机号格式不正确'))
    } else {
      callback()
    }
  }
}
const checkName = (rule, value, callback) => {

  if (!value) {

    callback(new Error('请输入中文名'))

  } else {

    const reg = /^[\u4e00-\u9fa5]+$/

    if (value.length < 100 && reg.test(value)) {

      callback()

    } else {

      return callback(new Error('请输入正确的中文名'))

    }

  }
}



function isVehicleNumber(vehicleNumber) {
  var xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
  var creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
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
    { trigger: 'blur', validator: rulescontactTelephone }
  ],
  trueName: [{ required: true, message: "请输入真实姓名", trigger: "blur" },
  { trigger: 'blur', validator: checkName }
  ],
  idCard: [{ required: true, message: "请输入身份证号码", trigger: "blur" },
  { validator: checkIdentitytionId, trigger: 'blur' }
  ],
  carNumber: [{ required: true, message: "请输入车牌号", trigger: "blur" },
  { validator: vehicleNumber, trigger: 'blur' }
  ],
};

</script>

<style scoped>
.info {
  text-align: center;
  padding: 35px 0;
}

.info-image {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 50px;
  overflow: hidden;
}

.info-image img {
  width: 100%;
  height: 100%;
}

.info-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-edit i {
  color: #eee;
  font-size: 25px;
}

.info-image:hover .info-edit {
  opacity: 1;
}

.info-name {
  margin: 15px 0 10px;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}

.crop-demo-btn {
  position: relative;
}

.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>