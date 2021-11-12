<template>
    <div>
        <section class="loading" v-show="isLoading">
            <van-loading color="#0094ff" />
        </section>
        <div class="home">
            <van-tabbar class="header" :fixed="false" v-model="active" @change="tabChange">
                <van-tabbar-item>全部</van-tabbar-item>
                <van-tabbar-item>男</van-tabbar-item>
                <van-tabbar-item>女</van-tabbar-item>
            </van-tabbar>
            <section class="container" :style="{'bottom': myWechat ? 0 : '0.3rem'}">
                <van-index-bar ref="vanIndexBar" class="my-index-bar" :index-list="newLetters">
                    <div v-if="noGetTypeData.length">
                        <van-index-anchor index="#" />
                        <div class="list" v-for="(item,index) in noGetTypeData" :key="index">
                            <div class="row" @click="detail(item.wechat)">
                                <div class="row-img" v-if="item.pictures">
                                    <van-image :src="NODE_ENV('','/nodejs') + item.pictures.split(',')[0]" :key="NODE_ENV('','/nodejs') + item.pictures.split(',')[0]">
                                        <template v-slot:loading>
                                            <van-loading type="spinner" size="20" />
                                        </template>
                                    </van-image>
                                </div>
                                <van-cell :title="getTitles(item.wechat,item.motto)" />
                            </div>
                            <section class="operation" v-if="item.wechat === myWechat">
                                <van-button size="mini" type="primary" @click="updateByWechat(item.wechat)">修改</van-button>
                                <van-button size="mini" type="warning" @click="deleteByWechat(item.wechat)">删除</van-button>
                            </section>
                        </div>
                    </div>
                    <div v-for="(item,index) in getTypeData" :key="index">
                        <van-index-anchor :index="index" />
                        <div class="list" v-for="(cell,cidx) in item" :key="cidx">
                            <div class="row" @click="detail(cell.wechat)">
                                <div class="row-img" v-if="cell.pictures">
                                    <van-image :src="NODE_ENV('','/nodejs') + cell.pictures.split(',')[0]" :key="NODE_ENV('','/nodejs') + cell.pictures.split(',')[0]">
                                        <template v-slot:loading>
                                            <van-loading type="spinner" size="20" />
                                        </template>
                                    </van-image>
                                </div>
                                <van-cell :title="getTitles(cell.wechat,cell.motto)" />
                            </div>
                            <section class="operation" v-if="cell.wechat === myWechat">
                                <van-button size="mini" type="primary" @click="updateByWechat(cell.wechat)">修改</van-button>
                                <van-button size="mini" type="warning" @click="deleteByWechat(cell.wechat)">删除</van-button>
                            </section>
                        </div>
                    </div>
                </van-index-bar>
            </section>
            <footer class="footer" v-if="!myWechat">
                <div class="footer-btn">
                    <span @click="register">
                        注册
                    </span>
                    <span @click="login">
                        登录
                    </span>
                </div>
            </footer>
        </div>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import pinyin from '../../common/pinyin';
@Component
export default class Home extends Vue {
    private isLoading: boolean = false;
    private letters: any = [
        '#',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
    ];
    private data: any = [];
    private myWechat = '';
    private newLetters: any = [];
    private getTypeData: any = {};
    private noGetTypeData: any = [];
    private active: any = 0;
    pinyinType() {
        this.data.sort((a: any, b: any) => a.wechat.localeCompare(b.wechat)); // 先排序
        this.data.forEach((item: any) => {
            item.code = pinyin.chineseToPinYin(item.wechat);
            item.code = item.code.slice(0, 1).toLocaleUpperCase();
            for (let val of this.letters) {
                if (item.code === val) {
                    item.isGetType = true; // 已分类
                    if (!this.newLetters.includes(val)) {
                        this.newLetters.push(val);
                    }
                    if (!this.getTypeData[val]) {
                        this.getTypeData[val] = [];
                    }
                    this.getTypeData[val].push(item);
                }
            }
        });
        this.noGetTypeData = this.data.filter((item: any) => !item.isGetType);
        if (this.noGetTypeData.length) {
            this.newLetters.unshift('#');
        }
        this.noGetTypeData.sort((a: any, b: any) => a.wechat - b.wechat);
    }
    async getData(data?: any) {
        this.newLetters = [];
        this.getTypeData = {};
        this.noGetTypeData = [];
        this.data = data;
        this.pinyinType();
    }
    getTitles(wechat: string, motto: string) {
        if (motto) {
            let w = (this.$refs.vanIndexBar as any).$el.clientWidth;
            let maxLength = 0;
            let length = 0;
            if (w <= 320) {
                maxLength = 14;
            } else if (w <= 375) {
                maxLength = 18;
            } else if (w <= 414) {
                maxLength = 20;
            } else {
                return `${wechat}（${motto}）`;
            }
            length = maxLength - wechat.length;
            if (length >= 0) {
                let _motto =
                    maxLength < wechat.length + motto.length
                        ? motto.substring(0, length) + '...'
                        : motto;
                return `${wechat}（${_motto}）`;
            } else {
                return wechat;
            }
        } else {
            return wechat;
        }
    }

    // 查看详情
    detail(wechat: string) {
        this.$store.commit('info/SET_WECHAT', wechat);
        this.$router.push({ name: 'detail', params: { wechat: wechat } });
    }
    // 删除
    deleteByWechat(wechat: string) {
        this.$dialog
            .confirm({
                message: '确定删除',
                className: 'dialog-confirm',
            })
            .then(async () => {
                this.isLoading = true;
                const result = await (this as any).$axios.post(
                    (this as any).NODE_ENV('/deleteByWechat'),
                    [wechat]
                );
                this.isLoading = false;
                if (result.status === 200) {
                    this.reloadData();
                    this.myWechat = '';
                    sessionStorage.removeItem('myWechat');
                    this.$notify({
                        type: 'success',
                        message: result.data.message,
                    });
                }
            })
            .catch(() => {
                // on cancel
            });
    }
    updateByWechat(wechat: string) {
        this.$store.commit('info/SET_WECHAT', wechat);
        this.$router.push({ name: 'update', params: { wechat: wechat } });
    }
    register() {
        this.$router.push('/register');
    }
    login() {
        this.$router.push('/login');
    }
    tabChange(val: any) {
        this.$store.commit('info/SET_SEX', val);
        this.reloadData(val);
    }
    async reloadData(val?: any) {
        let sex: any = [];
        let url = '/select';
        if (val && val !== '0') {
            url = '/selectBySex';
            sex = [JSON.stringify(val)];
        }
        this.isLoading = true;
        const result = await (this as any).$axios.post(
            (this as any).NODE_ENV(url),
            sex
        );
        this.isLoading = false;
        this.getData(result.data);
    }
    mounted() {
        this.active = Number(this.$store.getters['info/getSex']);
        this.reloadData(this.active);
        this.myWechat = this.$store.getters['info/getMyWechat'];
    }
}
</script>
<style lang="stylus" scoped>
.home {
    position: relative;
    width: 100%;
    height: 100%;

    .container {
        position: absolute;
        top: 0.4rem;
        bottom: 0.3rem;
        left: 0;
        width: 100%;
        overflow: auto;
    }

    .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 0.4rem;
        line-height: 0.4rem;
        border: 0.01rem solid #ebedf0;
        border-bottom: 0;
        text-align: center;
        color: #323233;
        background-color: #fff;
        z-index: 8;
        max-width: 7.5rem;
        margin: auto;
        box-shadow: 0px -1px 3px #ebedf1;

        .footer-btn {
            display: flex;
            align-items: center;

            span {
                width: 50%;
                color: #1989fa;

                &:nth-child(1) {
                    border-right: 0.01rem solid #ebedf0;
                }
            }
        }
    }
}
</style>

<style lang="stylus">
.my-index-bar {
    padding-bottom: 0.6rem;
    background-color: #f7f8fa;

    .list {
        background-color: #fff;
        border-top: 1px solid #ebedf0;

        &:last-child {
            border-bottom: 1px solid #ebedf0;
        }
    }

    .row {
        display: flex;
        align-items: center;
        margin: 0 0.1rem;
        padding: 0.1rem 0;

        .van-cell {
            padding: 0 16px;

            .van-cell__title {
                word-wrap: break-word;
                word-break: break-all;
            }
        }

        .row-img {
            width: 1rem;
            max-height: 1rem;
            overflow: hidden;

            .van-image {
                width: 100%;
            }

            img {
                width: 100%;
            }
        }
    }

    .operation {
        display: flex;
        justify-content: space-around;
        padding: 0.1rem 0;
        margin: 0 0.1rem;
        border-top: 1px dashed #ebedf0;

        .van-button {
            padding: 0 0.3rem;
        }
    }

    .van-index-anchor {
        left: 0 !important;
        background-color: #f7f8fa;
    }
}

.dialog-confirm {
    .van-dialog__footer {
        border-top: 0.01rem solid #ebedf0;
    }
}

.my-index-bar {
    .van-index-anchor {
        left: auto !important;
        right: auto !important;
    }
}

.header.van-tabbar {
    z-index: 9;
    height: 0.4rem;
    line-height: 0.4rem;
    background-color: #fff;
    box-shadow: 0px 3px 5px #e8eef5;

    .van-tabbar-item--active {
        background-color: #1989fa;

        &.van-tabbar-item {
            color: #fff;
        }
    }

    .van-tabbar-item {
        color: #1989fa;

        .van-tabbar-item__icon {
            margin: 0;
        }
    }
}
</style>