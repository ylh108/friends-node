<template>
    <div class="detail">
        <section class="loading" v-show="isLoading">
            <van-loading color="#0094ff" />
        </section>
        <header class="header">
            <van-icon name="arrow-left" class="arrow-back" @click="goHome" />
            <span>{{data.wechat}}</span>
        </header>
        <section class="container">
            <van-cell title="微信号" :value="data.wechat" />
            <van-cell v-if="data.sex" title="性别" :value="data.sex === '1' ? '男': '女'" />
            <van-cell v-if="data.marriage" title="婚姻状况" :value="data.marriage | formatMarriage" />
            <van-cell v-if="data.motto" title="格言" :value="data.motto" />
            <van-cell v-if="data.age" title="年龄" :value="data.age | formatAge" />
            <van-cell v-if="data.stature" title="身高" :value="data.stature | formatCM" />
            <van-cell v-if="data.weight" title="体重" :value="data.weight | formatKG" />
            <van-cell v-if="data.point" title="坐标" :value="data.point" />
            <van-cell v-if="data.place" title="籍贯" :value="data.place" />
            <van-cell v-if="data.industry" title="职业" :value="data.industry" />
            <van-cell v-if="data.family" title="家庭情况" :value="data.family" />
            <van-cell v-if="data.hobby" title="爱好" :value="data.hobby" />
            <van-cell v-if="data.my" title="关于我" :value="data.my" />
            <van-cell v-if="data.you" title="关于你" :value="data.you" />
            <van-cell v-if="data.remark" title="备注" :value="data.remark" />
            <div class="pictures" v-if="data.pictures">
                <span v-for="pic in data.pictures.split(',')" :key="pic">
                    <van-image v-if="pic" :src="NODE_ENV('','/nodejs') + pic">
                        <template v-slot:loading>
                            <van-loading type="spinner" size="20" />
                        </template>
                    </van-image>
                </span>
            </div>
        </section>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component({
    filters: {
        formatAge(val: string) {
            return val + '岁';
        },
        formatCM(val: string) {
            return val + 'cm';
        },
        formatKG(val: string) {
            return val + 'kg';
        },
    },
})
export default class Detail extends Vue {
    private isLoading: boolean = false;
    private data: any = {};
    mounted() {
        this.getDetail();
    }

    async getDetail() {
        let wechat = this.$route.params.wechat;
        if (!wechat) {
            wechat = this.$store.getters['info/getWechat'];
        }
        this.isLoading = true;
        const result = await (this as any).$axios.post(
            (this as any).NODE_ENV('/selectByWechat'),
            [wechat]
        );
        this.isLoading = false;
        this.data = result.data[0];
    }

    goHome() {
        this.$router.push('/');
    }
}
</script>

<style lang="stylus">
.detail {
    .van-cell__title {
        flex: none;
        width: 0.8rem;
        padding-right: 0.1rem;
    }

    .van-cell__value {
        text-align: left;
    }

    .pictures {
        background-color: #fff;
        padding: 0.1rem 0.16rem;

        .van-image {
            width: 100%;
        }

        img {
            margin-bottom: 0.1rem;
            width: 100%;
        }
    }
}
</style>