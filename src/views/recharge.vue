<template>
    <div>
        <el-space wrap fill style="width: 100%" direction="vertical">
            <div class="grid">
                <el-button plain class="grid-content" @click="putnum1()">10</el-button>
                <el-button plain class="grid-content" @click="putnum2()">20</el-button>
                <el-button plain class="grid-content" @click="putnum3()">40</el-button>
            </div>
            <div class="grid">
                <el-button plain class="grid-content" @click="putnum4()">60</el-button>
                <el-button plain class="grid-content" @click="putnum5()">80</el-button>
                <el-button plain class="grid-content" @click="putnum6()">99</el-button>
            </div>
            <div>
                <el-form :model="param" class="demo-tabs" :rules="rules" ref="money">
                    <el-form-item label="充值金额：" prop="number">
                        <el-input v-model="param.number" placeholder="请输入金额"></el-input>

                    </el-form-item>

                </el-form>
            </div>
            <el-button type="primary" @click="submitForm()">充值</el-button>
        </el-space>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { postRecharge } from "../api/api.js";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
let store = useStore();
let param = reactive({
    number: ""
})
let checkValue = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('值不能为空'))
    }
    setTimeout(() => {

        if (isNaN(parseInt(value))) {
            callback(new Error('请输入数字值'))
        } else {
            if (value < 1) {
                callback(new Error('值必须大于1'))
            } else {
                callback()
            }
        }
    }, 200)
}
function putnum1() {
    param.number = 10
}
function putnum2() {
    param.number = 20
}
function putnum3() {
    param.number = 40
}
function putnum4() {
    param.number = 60
}
function putnum5() {
    param.number = 80
}

function putnum6() {
    param.number = 99
}
let money = ref(null)
const rules = {
    number: [
        {
            required: true,
            message: "请输入金额",
            trigger: "blur",
        },
        { trigger: 'blur', validator: checkValue }
    ]
}
function submitForm() {
    money.value.validate(valid => {
        if (valid) {
            postRecharge({
                num: parseInt(param.number)
            }).then(res => {
                store.commit("addMoney", parseInt(param.number))
                ElMessage.success("充值成功")
            }).catch(e => {
                ElMessage.error("充值失败")
            })

        } else {
            return false
        }
    })
}
</script>

<style>
.grid-content {
    border-radius: 4px;
    min-height: 36px;
    min-width: 30px;
    margin-right: 72px;
    margin-left: 30px;
}

.grid {
    margin-bottom: 30px;
}
</style>