<template>
    <div class="register">
        <section class="loading" v-show="isLoading">
            <van-loading color="#0094ff" />
        </section>
        <header class="header">
            <van-icon name="arrow-left" class="arrow-back" @click="goHome" />{{$route.name === 'update' ? '修改' : '注册'}}
        </header>
        <van-form @submit="onSubmit">
            <van-field :readonly="$route.name === 'update'? true: false" clearable class="required" v-model="form.wechat" name="wechat" label="微信号" placeholder="微信号" />
            <van-field clearable @click-right-icon="rightIconClick" class="required" :type="passwordType" @focus="handlePasswordFocus" v-model="form.password" name="password" label="密码" placeholder="密码" :right-icon="!isOpen ? 'eye-o' : 'closed-eye'" />
            <van-field name="sex" class="required sex" label="性别">
                <template #input>
                    <van-dropdown-menu>
                        <van-dropdown-item v-model="form.sex" :options="sexOption" />
                    </van-dropdown-menu>
                </template>
            </van-field>
            <van-field name="marriage" class="required marriage" label="婚姻状况">
                <template #input>
                    <van-dropdown-menu>
                        <van-dropdown-item v-model="form.marriage" :options="marriageOption" />
                    </van-dropdown-menu>
                </template>
            </van-field>
            <van-field clearable autosize rows="2" type="textarea" v-model="form.motto" name="motto" label="格言" placeholder="一句话概括" />
            <van-field clearable type="number" class="age" v-model="form.age" name="age" label="年龄" placeholder="年龄" />
            <van-field clearable type="number" class="stature" v-model="form.stature" name="stature" label="身高" placeholder="身高" />
            <van-field clearable type="number" class="weight" v-model="form.weight" name="weight" label="体重" placeholder="体重" />
            <van-field clearable autosize rows="1" type="textarea" v-model="form.point" name="point" label="坐标" placeholder="坐标" />
            <van-field clearable autosize rows="1" type="textarea" v-model="form.place" name="place" label="籍贯" placeholder="籍贯" />
            <van-field clearable autosize rows="1" type="textarea" v-model="form.industry" name="industry" label="职业" placeholder="职业" />
            <van-field clearable autosize rows="1" type="textarea" v-model="form.family" name="family" label="家庭情况" placeholder="家庭情况" />
            <van-field clearable autosize rows="2" type="textarea" v-model="form.hobby" name="hobby" label="爱好" placeholder="爱好" />
            <van-field clearable autosize rows="2" type="textarea" class="required" v-model="form.my" name="my" label="关于我" placeholder="关于我" />
            <van-field clearable autosize rows="2" type="textarea" class="required" v-model="form.you" name="you" label="关于你" placeholder="关于你" />
            <van-field clearable autosize rows="2" type="textarea" v-model="form.remark" name="remark" label="备注" placeholder="备注" />
            <van-field name="pictures" label="图片">
                <template #input>
                    <van-uploader v-model="form.pictures" multiple :before-read="beforeRead" :after-read="afterRead" />
                </template>
            </van-field>
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
import { imageToBase64, base64ToFile, getBase64 } from '@/common/file';
@Component({
    components: {},
})
export default class Register extends Vue {
    private isLoading: boolean = false;
    private once: boolean = false; // 第一次加载
    private passwordType: string = 'text';
    private isOpen: boolean = false;
    private rules = {
        wechat: '微信号',
        password: '密码',
        sex: '性别',
        marriage: '婚姻状况',
        my: '关于我',
        you: '关于你',
    };
    private form: any = {
        wechat: '',
        password: '',
        sex: '',
        marriage: '',
        motto: '',
        age: '',
        stature: '',
        weight: '',
        point: '',
        place: '',
        industry: '',
        family: '',
        hobby: '',
        my: '',
        you: '',
        remark: '',
        pictures: [],
    };
    sexOption: object = [
        { text: '男', value: '1' },
        { text: '女', value: '2' },
    ];
    marriageOption: object = [
        { text: '未婚', value: '0' },
        { text: '已婚', value: '1' },
        { text: '离异', value: '2' },
        { text: '分居', value: '3' },
        { text: '丧偶', value: '4' },
    ];
    // 返回布尔值
    beforeRead(file: any) {
        // 一张图片
        if (
            !file.length &&
            !/\.(gif|jpg|jpeg|png|bmp|svg|jfif|ico)$/.test(file.name)
        ) {
            this.$notify({
                type: 'warning',
                message: '图片格式不正确',
            });
            return false;
        } else {
            // 多张图片
            for (let i = 0; i < file.length; i++) {
                if (
                    !/\.(gif|jpg|jpeg|png|bmp|svg|jfif|ico)$/.test(file[i].name)
                ) {
                    this.$notify({
                        type: 'warning',
                        message: '图片格式不正确',
                    });
                    return false;
                }
            }
        }
        console.log(file);
        return true;
    }
    afterRead(pictures: any) {
        console.log(this.form.pictures);
    }
    required() {
        for (let i in this.form) {
            for (let key in this.rules) {
                // if (i === 'pictures' && !this.form.pictures.length) {
                //     this.$notify({
                //         type: 'warning',
                //         message: (this.rules as any)[i] + ' 不能为空',
                //     });
                //     return false;
                // } else
                if (!this.form[i] && this.form[i] !== 0 && i === key) {
                    this.$notify({
                        type: 'warning',
                        message: (this.rules as any)[i] + ' 不能为空',
                    });
                    return false;
                }
            }
        }
        return true;
    }
    async onSubmit(values: any) {
        if (!this.required()) return;
        this.isLoading = true;
        let params: object = [];
        let url: string = '';
        let result: any = null;
        // 注册
        if (this.$route.name === 'register') {
            url = (this as any).NODE_ENV('/save');
            params = [
                this.form.wechat,
                this.form.password,
                this.form.sex,
                this.form.marriage,
                this.form.motto,
                this.form.age,
                this.form.stature,
                this.form.weight,
                this.form.point,
                this.form.place,
                this.form.industry,
                this.form.family,
                this.form.hobby,
                this.form.my,
                this.form.you,
                this.form.remark,
                '',
            ];
            result = await (this as any).$axios.post(
                (this as any).NODE_ENV('/selectAllWechat'),
                [this.form.wechat]
            );
            let hasWechat = result.data.some(
                (item: any) => item.wechat === this.form.wechat
            );
            if (hasWechat) {
                this.$notify({
                    type: 'warning',
                    message: '微信号已存在',
                });
                return;
            }
        }
        // 修改
        else if (this.$route.name === 'update') {
            url = (this as any).NODE_ENV('/updateByWechat');
            params = [
                this.form.password,
                this.form.sex,
                this.form.marriage,
                this.form.motto,
                this.form.age,
                this.form.stature,
                this.form.weight,
                this.form.point,
                this.form.place,
                this.form.industry,
                this.form.family,
                this.form.hobby,
                this.form.my,
                this.form.you,
                this.form.remark,
                this.form.wechat,
            ];
            // 删除本地images中的图片-根据微信号
            await (this as any).$axios.post(
                (this as any).NODE_ENV('/deleteImagesByWechat'),
                [this.form.wechat]
            );
        }
        result = await (this as any).$axios.post(url, params);
        if (result.status === 200) {
            // 上传图片
            let formData: any = new FormData();
            if (this.form.pictures.length) {
                for (
                    let i = 0, item: any = this.form.pictures;
                    i < item.length;
                    i++
                ) {
                    formData.append('file', item[i].file);
                }
            }
            formData.append('wechat', this.form.wechat);
            // 添加请求头
            let headers = {
                'Content-Type': 'multipart/form-data;charset=utf-8',
            };
            url = (this as any).NODE_ENV('/uploadPics');
            // 修改本地nodejs文件夹中的图片
            await (this as any).$axios({
                method: 'post',
                url: url,
                data: formData,
                headers,
            });
            this.$notify({
                type: 'success',
                message: result.data.message,
            });
            this.isLoading = false;
            this.$store.commit('info/SET_MYWECHAT', this.form.wechat);
            this.$router.push('/');
        }
    }
    goHome() {
        this.$router.push('/');
    }
    async created() {
        if (this.$route.name === 'update') {
            this.isLoading = true;
            // 密码类型初始化
            this.handlePasswordFocus();
            let wechat = this.$route.params.wechat;
            if (!wechat) {
                wechat = this.$store.getters['info/getWechat'];
            }
            const result = await (this as any).$axios.post(
                (this as any).NODE_ENV('/selectByWechat'),
                [wechat]
            );
            if (result.data[0].pictures) {
                let picList: any = [];
                const pictures = result.data[0].pictures.split(',');
                // 图片初始化
                pictures.forEach((pic: string, index: number) => {
                    if (pic) {
                        this.handleImgToBase64(
                            (this as any).NODE_ENV('', '/nodejs' + pic),
                            (file: any) => {
                                picList.push(file);
                                if (index === pictures.length - 1) {
                                    result.data[0].pictures = picList;
                                    this.form = result.data[0];
                                }
                            }
                        );
                    }
                });
            } else {
                result.data[0].pictures = [];
                this.form = result.data[0];
            }
            this.isLoading = false;
        }
    }

    handleImgToBase64(url: string, cb: any) {
        getBase64(url, (base64Img: string) => {
            let image = new Image();
            image.crossOrigin = '';
            image.src = url;
            image.onload = () => {
                let file = base64ToFile(base64Img, 'file'); //base64转File
                cb({ content: base64Img, file, message: '', status: '' });
            };
        });
    }
    // handleImgToBase64(url: string, cb: any) {
    //     let image = new Image();
    //     image.crossOrigin = '';
    //     image.src = url;
    //     image.onload = () => {
    //         let base64 = imageToBase64(image); //图片转base64 不能转gif等动画格式图片
    //         let file = base64ToFile(base64, 'file'); //base64转File
    //         cb({ content: base64, file, message: '', status: '' });
    //     };
    // }
    rightIconClick() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.passwordType = 'text';
        } else {
            this.passwordType = 'password';
        }
    }
    handlePasswordFocus() {
        if (!this.once) {
            this.once = true;
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
.register {
    .required {
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

    .van-cell {
        // background-color: transparent;
    }

    .age {
        .van-cell__value {
            &::after {
                // content: '岁';
                position: absolute;
                top: 0;
                right: 0;
                border: 0.01rem solid #ebedf0;
                padding: 0 0.05rem;
            }

            .van-field__control {
                width: calc(100% - 0.4rem);
            }
        }
    }

    .age {
        .van-cell__value {
            &::after {
                content: '岁';
                position: absolute;
                top: 0;
                right: 0;
                border: 0.01rem solid #ebedf0;
                padding: 0 0.05rem;
            }

            .van-field__control {
                width: calc(100% - 0.4rem);
            }

            .van-icon-clear {
                margin-right: 0.4rem;
            }
        }
    }

    .stature {
        .van-cell__value {
            &::after {
                content: 'cm';
                position: absolute;
                top: 0;
                right: 0;
                border: 0.01rem solid #ebedf0;
                padding: 0 0.05rem;
            }

            .van-field__control {
                width: calc(100% - 0.4rem);
            }

            .van-icon-clear {
                margin-right: 0.4rem;
            }
        }
    }

    .weight {
        .van-cell__value {
            &::after {
                content: 'kg';
                position: absolute;
                top: 0;
                right: 0;
                border: 0.01rem solid #ebedf0;
                padding: 0 0.05rem;
            }

            .van-field__control {
                width: calc(100% - 0.4rem);
            }

            .van-icon-clear {
                margin-right: 0.4rem;
            }
        }
    }

    .sex {
        .van-dropdown-menu {
            width: 100%;

            .van-dropdown-menu__bar {
                height: auto;
                box-shadow: none;
                background-color: transparent;
            }

            .van-dropdown-item--down {
                top: 1.72rem !important;
            }

            .van-dropdown-menu__title {
                width: calc(100% - 0.16rem);
                height: 0.24rem;
            }
        }
    }

    .marriage {
        .van-dropdown-menu {
            width: 100%;

            .van-dropdown-menu__bar {
                height: auto;
                box-shadow: none;
                background-color: transparent;
            }

            .van-dropdown-item--down {
                top: 2.16rem !important;
            }

            .van-dropdown-menu__title {
                width: calc(100% - 0.16rem);
                height: 0.24rem;
            }
        }
    }
}
</style>