<template>
  <div class="login-wrap">
    <div class="ms-login">
      <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="登录" name="first">
          <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
            <el-form-item prop="username">
              <el-input v-model="param.username" placeholder="请输入账号">
                <template #prepend>
                  <el-button icon="el-icon-user"></el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" placeholder="请输入密码" v-model="param.password" @keyup.enter="submitForm()">
                <template #prepend>
                  <el-button icon="el-icon-lock"></el-button>
                </template>
              </el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm()">登录</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="second">
          <el-form :model="param2" :rules="rules2" ref="register" label-width="0px" class="ms-content">
            <el-form-item prop="username">
              <el-input v-model="param2.username" placeholder="请输入账号">
                <template #prepend>
                  <el-button icon="el-icon-user"></el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" placeholder="请输入密码" v-model="param2.password" @keyup.enter="submitForm2()">
                <template #prepend>
                  <el-button icon="el-icon-lock"></el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password2">
              <el-input type="password" placeholder="请输入密码" v-model="param2.password2" @keyup.enter="submitForm2()">
                <template #prepend>
                  <el-button icon="el-icon-lock"></el-button>
                </template>
              </el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm2()">注册</el-button>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="ms-title">校园车辆管理系统</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { postLogin, postRegister } from "../api/api.js";
const activeName = ref('first')
const router = useRouter();
const param = reactive({
  username: "",
  password: "",
});
const param2 = reactive({
  username: "",
  password: "",
  password2: "",
});

const store = useStore();
const rules = {
  username: [
    {
      required: true,
      message: "请输入账号",
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
let validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== param2.password) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    console.log(param2.password, value)
    callback();
  }
};
const rules2 = {
  username: [
    {
      required: true,
      message: "请输入账号",
      trigger: "blur",
    },
    { min: 3, max: 7, message: "长度在 3 到 7 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 5, max: 10, message: "长度在 5 到 10 个字符", trigger: "blur" },
  ],
  password2: [
    { required: true, validator: validatePass, trigger: "blur" }, ,
  ],
};
const login = ref(null);
const register = ref(null);
const submitForm = () => {
  login.value.validate((valid) => {
    if (valid) {
      postLogin({
        phone: param.username,
        verify_code: param.password,
      }).then((res) => {
        let data = res.data;
        console.log(data);
        ElMessage.success("登录成功");
        store.commit("changeLogin", data.token);
        store.commit("setUserInfo", data.user_info);
        localStorage.setItem("car_IsComplet", data.user_info.IsComplete.toString())
        router.push("/");
      }).catch((e) => {
        console.log(e);
        ElMessage.error("登录失败");
      })
    } else {
      return false;
    }
  });
}
const submitForm2 = () => {
  register.value.validate((valid) => {
    if (valid) {
      postRegister({
        phone: param2.username,
        verify_code: param2.password,
      }).then((res) => { ElMessage.success("注册成功，赶快登录吧"); }).catch((e) => {
        console.log(e.response);
        ElMessage.error("注册失败," + e.response.data.err);
      });
    } else {
      return false;
    }
  });
};
store.commit("clearTags");
const handleClick = (tab, event) => {
  param.username = ""
  param.password = ""
  param2.username = ""
  param2.password = ""
  param2.password2 = ""
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/campus.jpg);
  background-size: auto 100%;
  background-repeat: no-repeat;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: rgb(82, 62, 62);
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.8);
  overflow: visible;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: rgb(114, 93, 93);
}
</style>
