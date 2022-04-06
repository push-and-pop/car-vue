<template>
    <div>
        <el-row>
            <el-col :span="12" :offset="6">
                <el-input
                    class="inputarea"
                    v-model="textarea"
                    :autosize="{ minRows: 8, maxRows: 8 }"
                    type="textarea"
                    placeholder="输入新公告"
                />
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
const textarea = ref("")
</script>

<style  scoped>
.inputarea {
    height: 70px;
    text-align: center;
}
</style>