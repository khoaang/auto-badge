bgSolidChoice = document.querySelector("#solid-color");
bgGradientChoice = document.querySelector("#gradient-color");
bgImageChoice = document.querySelector("#image-background");
bgImageFile = document.querySelector("#bg-image-file");
solidColorPicker = document.querySelector("#solid-color-picker");
badge = document.querySelector(".badge");

function changeBgImg(event) {
    url = URL.createObjectURL(event.target.files[0]);
    console.log(url);
    badge.style.background = `cover url(${url} no-repeat)`;
}
function uploadSpreadsheet() {
    var file = document.querySelector("#spreadsheet-file").files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        console.log(reader.result);
    };
}
const changeBg = () => {
    if (bgSolidChoice.checked) {
        document.querySelector("#color-options").hidden = false;
        document.querySelector("#gradient-options").hidden = true;
        document.querySelector("#image-options").hidden = true;
        console.log("solid color picked");
        badge.style.background = solidColorPicker.value;
    }
    if (bgGradientChoice.checked) {
        document.querySelector("#color-options").hidden = true;
        document.querySelector("#gradient-options").hidden = false;
        document.querySelector("#image-options").hidden = true;
        console.log("gradient picked");
    }
    if (bgImageChoice.checked) {
        document.querySelector("#color-options").hidden = true;
        document.querySelector("#gradient-options").hidden = true;
        document.querySelector("#image-options").hidden = false;
        console.log("image option picked");
    }
};