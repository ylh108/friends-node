import Vue from 'vue'

Vue.filter('formatMarriage', (val: string) => {
    switch (val) {
        case '0':
            return '未婚';
        case '1':
            return '已婚';
        case '2':
            return '离异';
        case '3':
            return '分居';
        case '4':
            return '丧偶';
        default:
            return ''
    }
})