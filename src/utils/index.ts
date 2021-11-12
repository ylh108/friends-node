
/**
 * 
 * @param url nodejs接口请求地址
 * @param picNode_Env 图片
 * @returns 
 */
export function NODE_ENV(url: string, picNode_Env?: string) {
    if (process.env.NODE_ENV === 'production') { // 生产环境(获取node.js接口数据)
        if (picNode_Env) {
            return 'http://node.linaige.com' + picNode_Env
        }
        return 'http://node.linaige.com:3000' + url;
    }
    // else if(process.env.NODE_ENV === 'development') { // 开发环境
    else {
        if (picNode_Env) {
            return picNode_Env
        }
        return '/api' + url;
    }
}