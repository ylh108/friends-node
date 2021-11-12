<template>
    <div class="login">
        <section class="loading" v-show="isLoading">
            <van-loading color="#0094ff" />
        </section>
        <header class="header">
            <van-icon name="arrow-left" class="arrow-back" @click="goHome" />登录
        </header>
        <van-form ref="form" @submit="onSubmit">
            <van-field clearable class="required" name="wechat" v-model="form.wechat" label="微信号" placeholder="微信号" />
            <van-field clearable :type="passwordType" @click-right-icon="rightIconClick" @focus="handlePasswordFocus" v-model="form.password" class="password" name="password" label="密码" placeholder="密码" :right-icon="!isOpen ? 'eye-o' : 'closed-eye'" />
            <div class="submit">
                <van-button round block type="info" size="small" native-type="submit">
                    确认
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component({
    components: {},
})
export default class Login extends Vue {
    private isLoading: boolean = false;
    private once: boolean = false; // 第一次加载
    private passwordType: string = 'text';
    private isOpen: boolean = false;
    private form: any = {
        wechat: '',
        password: '',
    };
    async onSubmit() {
        if (!this.form.wechat) {
            this.$notify({
                type: 'warning',
                message: '微信号 不能为空',
            });
            return;
        }
        if (!this.form.password) {
            this.$notify({
                type: 'warning',
                message: '密码 不能为空',
            });
            return;
        }
        this.isLoading = true;
        const result = await (this as any).$axios.post(
            (this as any).NODE_ENV('/select')
        );
        this.isLoading = false;
        let isWechat = result.data.some((item: any) => {
            if (
                item.wechat === this.form.wechat &&
                item.password === this.form.password
            ) {
                return true;
            }
        });
        if (!isWechat) {
            this.$notify({
                type: 'danger',
                message: '微信号或密码 错误',
            });
            return;
        }
        this.$notify({
            type: 'success',
            message: '登录成功',
        });
        this.$store.commit('info/SET_MYWECHAT', this.form.wechat);
        this.$router.push('/');
    }
    goHome() {
        this.$router.push('/');
    }
    handlePasswordFocus() {
        if (!this.once) {
            this.once = true;
            this.passwordType = 'password';
        }
    }
    rightIconClick() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.passwordType = 'text';
        } else {
            this.passwordType = 'password';
        }
    }
}
</script>
<style lang="stylus" scoped>
.submit {
    padding: 0.32rem 0.16rem;
}
</style>

<style lang="stylus">
.login {
    .van-field__label {
        span {
            position: relative;

            &::after {
                content: '*';
                position: absolute;
                color: red;
                right: -10px;
            }
        }
    }
}
</style>