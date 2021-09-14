const { spread } = require("lodash");

bgSolidChoice = document.querySelector("#solid-color");
bgGradientChoice = document.querySelector("#gradient-color");
bgImageChoice = document.querySelector("#image-background");
bgImageFile = document.querySelector("#bg-image-file");
solidColorPicker = document.querySelector("#solid-color-picker");

borderOptions = document.querySelector("#border-options");
hasBorder = document.querySelector("#yes-border");
borderColor = document.querySelector("#border-color");
borderRange = document.querySelector("#border-thickness");
borderLabel = document.querySelector("#border-label");

textColor = document.querySelector("#text-color-picker");

logoTopImageFile = document.querySelector("#logo-top-image-file");
logoTop = document.querySelector(".logo-top");
logoBottomImageFile = document.querySelector("#logo-bottom-image-file");
logoBottom = document.querySelector(".logo-bottom");

badge = document.querySelector(".badge");
border = "";
background = "";
colorStyle = "";

spreadsheet = [];

function changeBgImg() {
    const blob = new Blob([bgImageFile.files[0]]);
    url = URL.createObjectURL(blob);
    console.log(url);
    background = `background: url(${url}) !important; background-size: cover !important; background-position: center !important;`;
    changeStyling();
}

function changelogoTop() {
    const blob = new Blob([logoTopImageFile.files[0]]);
    url = URL.createObjectURL(blob);
    console.log(url);
    logoTop.src = url;
}

function changelogoBottom() {
    const blob = new Blob([logoBottomImageFile.files[0]]);
    url = URL.createObjectURL(blob);
    console.log(url);
    logoBottom.src = url;
}

function uploadSpreadsheet() {
    var file = document.querySelector("#spreadsheet-file").files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        console.log(reader.result);
        var csvarray = [];
        var data = reader.result;
        var rows = data.split("\r\n");
        for (var i = 1; i < rows.length; i++) {
            var row = rows[i].split(",");
            csvarray.push(rows[i].split(","));
        }
        spreadsheet = csvarray;
        console.log(csvarray);
    };
}
const changeBg = () => {
    if (bgSolidChoice.checked) {
        document.querySelector("#bg-color-options").hidden = false;
        document.querySelector("#gradient-options").hidden = true;
        document.querySelector("#image-options").hidden = true;
        console.log("solid color picked");
        background = `background: ${solidColorPicker.value} !important;`;
    }
    if (bgGradientChoice.checked) {
        document.querySelector("#bg-color-options").hidden = true;
        document.querySelector("#gradient-options").hidden = false;
        document.querySelector("#image-options").hidden = true;
        console.log("gradient picked");
    }
    if (bgImageChoice.checked) {
        document.querySelector("#bg-color-options").hidden = true;
        document.querySelector("#gradient-options").hidden = true;
        document.querySelector("#image-options").hidden = false;
        console.log("image option picked");
    }
    changeStyling();
};

const changeBorder = () => {
    if (hasBorder.checked) {
        borderOptions.style = "color: black !important;";
        borderRange.disabled = false;
        console.log(borderRange.value);
        border = `border: ${borderRange.value}px solid ${borderColor.value} !important;`;
        borderLabel.innerHTML = `Thickness: ${borderRange.value}px`;
    } else {
        borderOptions.style = "color: grey !important;";
        borderRange.disabled = true;
        border = "border: 0;";
        borderLabel.innerHTML = "Thickness: 0px";
    }
    changeStyling();
};

const changeTextColor = () => {
    colorStyle = `color: ${textColor.value} !important;`;
    changeStyling();
};

const changeStyling = () => {
    badge.style = border + background + colorStyle;
};

function printBadges() {
    document.querySelector(".name").innerHTML = spreadsheet[0][0];
    document.querySelector(".occupation").innerHTML = spreadsheet[0][1];
    window.print();
}

// Add persistence across reloads
changeBg();
changeBorder();
changeTextColor();
