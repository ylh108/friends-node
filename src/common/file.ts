// 图片转base64,*但不能转image/gif等格式的动画图片
export const imageToBase64 = (img: any) => {
    let canvas: any = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
    let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    let dataURL = canvas.toDataURL("image/" + ext, 1.0);
    return dataURL;
};
// 将base64图片转file文件
export const base64ToFile = (urlData: any, fileName: any) => {
    let arr: any = urlData.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bytes = atob(arr[1]); // 解码base64
    let n = bytes.length
    let ia = new Uint8Array(n);
    while (n--) {
        ia[n] = bytes.charCodeAt(n);
    }
    return new File([ia], fileName, { type: mime });
}
// 将图片转base64,能转image/gif等格式的动画图片
export const getBase64 = (imgUrl: string, callback: any) => {
    let xhr = new XMLHttpRequest();
    xhr.open("get", imgUrl, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (this.status == 200) {
            //得到一个blob对象
            let blob = this.response;
            let oFileReader = new FileReader();
            oFileReader.onloadend = (e: any) => {
                callback(e.target.result);
            };
            oFileReader.readAsDataURL(blob);
        }
    }
    xhr.send();
}