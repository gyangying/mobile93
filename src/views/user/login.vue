<template>
  <div class="container">
    <!-- 表头信息显示 -->
    <van-nav-bar title="登录"></van-nav-bar>
    <!-- 表单部分
      vant里边没有form相关组件，只有普通表单域组件
      van-cell-group是对普通表单域组件做封装
    -->
    <van-cell-group>
      <!-- 用ValidationObserver组件把全部的校验项目给包围起来
ref设置好，使得可以通过 this.$refs.xx 的方式获得当前的组件对象
      -->
      <ValidationObserver ref="loginFormRef">
        <!-- rules:校验规则
      name：提示内容名称
      errors：
        -->
        <ValidationProvider rules="required|phone" name="手机号" v-slot="{errors}">
          <!--van-field 输入框表单域组件
        label="手机号" 表单域前边的名字设置
        required：不进行校验，设置表单域前边有"红星"
        clearable：表单域内容可以通过右侧“叉号”清除
          -->
          <van-field
            v-model="loginForm.mobile"
            type="tel"
            label="手机号"
            placeholder="请输入手机号码"
            required
            clearable
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider rules="required" name="验证码" v-slot="{ errors }">
          <van-field
            v-model="loginForm.code"
            type="password"
            label="验证码"
            placeholder="验证码"
            required
            clearable
            :error-message="errors[0]"
          >
            <!-- "命名插槽"应用，提示相关按钮，是要给van-field组件内部的slot去填充的
        size="small" 设置按钮大小的
        type="primary" 设置按钮背景颜色
            -->
            <van-button slot="button" size="small" type="primary">发送验证码</van-button>
          </van-field>
        </ValidationProvider>
      </ValidationObserver>
    </van-cell-group>
    <!--van-button
        type:按钮背景颜色,info是蓝色
        size:按钮大小的
        round：圆边效果
        block：块级样式设置，占据一行
    -->
    <div class="login-btn">
      <van-button
        round block
        type="info"
        size="small"
        @click="login()"
        :loading="isLogin"
        loading-text="登录中..."
      >登录</van-button>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { userLoginApi } from '@/api/user.js'
export default {
  name: 'login',
  data () {
    return {
      isLogin: false, // 登录按钮是否加载等待
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    async login () {
      const res = await this.$refs.loginFormRef.validate()
      if (!res) {
        // 校验失败，停止后续代码执行
        return false
      }
      // 按钮处于加载中
      this.isLogin = true
      try {
        const res = await userLoginApi(this.loginForm)
        this.$store.commit('updateUser', res)
      } catch (err) {
        // 回复按钮加载中状态
        this.isLogin = false
        return this.$toast.fail('用户名或密码错误' + err)
      }
      // 回复按钮加载中状态
      this.isLogin = false
      this.$toast.success('登陆成功')
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped lang='less'>
.login-btn {
  margin: 40px;
}
</style>
