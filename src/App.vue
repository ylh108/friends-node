<template>
    <div id="app">
        <transition :name="$store.state.transitionName">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive" :key="key" class="router"></router-view>
            </keep-alive>
        </transition>
        <transition :name="$store.state.transitionName">
            <router-view v-if="!$route.meta.keepAlive" class="router"></router-view>
        </transition>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class App extends Vue {
    get key() {
        return this.$route.path;
    }
    mounted() {
        window.onload = function () {
            // 阻止ios双击页面屏幕放大
            document.addEventListener('touchstart', function (event) {
                if (event.touches.length > 1) {
                    event.preventDefault();
                }
            });
            document.addEventListener('gesturestart', function (event) {
                event.preventDefault();
            });
        };
    }
}
</script>

<style lang="stylus">
@import './stylus/slider';

html, body {
    width: 100%;
    height: 100%;
    font-size: 625%;
}

body {
    margin: 0;
    font-size: 0.14rem;
}

#app {
    position: relative;
    max-width: 7.5rem;
    height: 100%;
    font-family: 'Microsoft YaHei', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    background-color: #f7f8fa;
    margin: 0 auto;
    padding: 0;
    overflow-x: hidden;
}

.header {
    position: relative;
    height: 0.4rem;
    line-height: 0.4rem;
    background-color: #1989fa;
    text-align: center;
    color: #fff;
    z-index: 9;
    box-shadow: 0px -1px 3px #ebedf1;
    overflow: hidden;

    .arrow-back {
        position: absolute;
        font-size: large;
        left: 0.1rem;
        top: 50%;
        transform: translateY(-50%);
    }

    span {
        display: flex;
        padding: 0 0.2rem 0 0.4rem;
        overflow: hidden;
        word-break: break-all;
        overflow-wrap: break-word;
        align-items: center;
        justify-content: center;
        word-wrap: break-word;
        word-break: break-all;
    }
}

input {
    background-color: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;

    &:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
        -webkit-text-fill-color: $bg !important;
        -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
        background-color: transparent;
        background-image: none;
        transition: background-color 50000s ease-in-out 0s; // 背景色透明  生效时长  过渡效果  启用时延迟的时间
    }
}

.loading {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 0.3rem;
    height: 0.3rem;
    background-color: #fff;
    border-radius: 50%;
    z-index: 10;
}
</style>
