function list() {
    let index = location.href.indexOf('/content');
    let back = location.href.substring(0,index);
    window.location.href = back;
}
$(function () {
    let size = getScreenState();
    if (size.width < size.height) {
        document.querySelector('#background_img').setAttribute('src', '../../../assets/sbg.jpg')
    }
});
function getScreenState() {
    if(window.innerHeight !== undefined){
        return {
            "width": window.innerWidth,
            "height": window.innerHeight
        }

    }else if(document.compatMode === "CSS1Compat"){
        return {
            "width": document.documentElement.clientWidth,
            "height": document.documentElement.clientHeight
        }
    }else{
        return {
            "width": document.body.clientWidth,
            "height": document.body.clientHeight
        }
    }
}