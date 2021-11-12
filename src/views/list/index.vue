<template>
    <div>
        <van-index-bar ref="vanIndexBar" class="my-index-bar" :index-list="newLetters">
            <van-index-anchor index="#" />
            <div v-for="(item,index) in noGetTypeData" :key="index">
                <van-cell :title="item.name" />
            </div>
            <div v-for="(item,index) in getTypeData" :key="index">
                <van-index-anchor :index="index" />
                <van-cell v-for="(cell,cidx) in item" :key="cidx" :title="cell.name" />
            </div>
        </van-index-bar>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import pinyin from '../../common/pinyin';
@Component
export default class List extends Vue {
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
    private newLetters: any = [];
    private data: any = [
        { name: '66' },
        { name: '王五' },
        { name: 'wuhaha' },
        { name: '赵六' },
        { name: 'wuhaha' },
        { name: '余喝' },
        { name: 'an' },
        { name: '李四' },
        { name: '12' },
        { name: '安安' },
        { name: '大伯' },
    ];
    private getTypeData: any = {};
    private noGetTypeData: any = [];
    pinyinType() {
        this.data.sort((a: any, b: any) => a.name.localeCompare(b.name)); // 先排序
        this.data.forEach((item: any) => {
            item.code = pinyin.chineseToPinYin(item.name);
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
        this.noGetTypeData.sort((a: any, b: any) => a.name - b.name);
    }
    mounted() {
        this.pinyinType();
    }
}
</script>

<style lang="stylus">
.my-index-bar {
    .van-index-anchor {
        background-color: #f7f8fa;
    }
}
</style>