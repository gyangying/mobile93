<template>
  <div class="page-user-profile">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="编辑资料"
      right-text="保存"
      @click-right="saveProfile()"
    ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center @click="showPhoto=true">
        <!--
        slot="default" 自定义单元格右侧内容
        fit="cover"  图片填充模式 保持宽高缩放图片，使图片的短边能完全显示出来，裁剪长边
        -->
        <van-image
          slot="default"
          width="56"
          height="56"
          fit="cover"
          round
          :src="userProfile.photo"
        />
      </van-cell>
      <!-- value=xxx 设置单元格右侧内容部分 -->
      <van-cell
        is-link
        title="名称"
        :value="userProfile.name"
        @click="showName=true"
        style="height:25%"
      />
      <van-cell is-link title="性别" :value="userProfile.gender === 0?'男':'女'" @click="showSex=true" />
      <van-cell is-link title="生日" :value="userProfile.birthday" @click="showBirthday=true" />
    </van-cell-group>
    <!-- 弹出层 -->
    <van-popup v-model="showPhoto" position="bottom">
      <van-cell title="本地相册选择图片" is-link @click="$refs.mypic.click()"></van-cell>
      <van-cell title="拍照" is-link></van-cell>
    </van-popup>
    <!-- 隐藏状态的上传表单域 -->
    <input type="file" ref="mypic" @change="startUpload()" style="display:none;" />

    <van-popup v-model="showName" position="bottom">
      <van-field v-model="userProfile.name" type="text"></van-field>
    </van-popup>
    <van-action-sheet v-model="showSex" :actions="sexMenus" @select="onSelect" cancel-text="取消"></van-action-sheet>
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
        @cancel="showBirthday = false"
      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { userProfileApi, userPhotoApi, userSaveProfileApi } from '@/api/user.js'
export default {
  name: 'user-profile',
  data () {
    return {
      showBirthday: false,
      currentDate: new Date(),
      minDate: new Date(1990, 0, 1),
      maxDate: new Date(2100, 0, 1),
      showPhoto: false,
      showName: false,
      showSex: false,
      sexMenus: [{ name: '男' }, { name: '女' }],
      userProfile: {
        photo: '',
        name: '我是华仔',
        gender: 0, // 0 男 1 女
        birthday: '1993-09-01'
      }
    }
  },
  created () {
    this.getUserProfile()
  },
  methods: {
    async startUpload () {
      const fobj = this.$refs.mypic.files[0]
      const fd = new FormData()
      fd.append('photo', fobj)
      const res = await userPhotoApi(fd)
      this.userProfile.photo = res.photo
      this.showPhoto = false
      this.$toast.success('头像更新成功!')
    },
    onConfirm (val) {
      this.userProfile.birthday = dayjs(val).format('YYYY-MM-DD')
      this.showBirthday = false
    },
    // val：被选中项目的数据
    onSelect (val) {
      this.userProfile.gender = val.name === '男' ? 0 : 1
      // console.log(this.userProfile.gender)
      this.showSex = false
    },
    async getUserProfile () {
      this.userProfile = await userProfileApi()
      this.currentDate = new Date(this.userProfile.birthday)
    },
    async saveProfile () {
      await userSaveProfileApi(this.userProfile)
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped lang='less'></style>
