// journalism ~ eternity.martinez@student.rjuhsd.us

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

var spreadsheet = [];

function changeBgImg() {
    const blob = new Blob([bgImageFile.files[0]]);
    url = URL.createObjectURL(blob);
    console.log(url);
    background = `background: url(${url}) !important; background-size: cover !important; background-position: center !important;`;
    changeStyling();
}

function changeLogoTop() {
    const blob = new Blob([logoTopImageFile.files[0]]);
    url = URL.createObjectURL(blob);
    console.log(url);
    logoTop.src = url;
}

function changeLogoBottom() {
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

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

async function loadImage(imageLink) {
    return new Promise((resolve, reject) => {
        document.querySelector("#profile").src = imageLink;
        document.querySelector("#profile").onload = async () => {
            console.log("Image Loaded");
            resolve(true);
        };
    });
}

function printBadges() {
    var promises = [];
    var index = 0;
    spreadsheet.forEach((row) => {
        var imageLink =
            "https://drive.google.com/thumbnail?id=" + row[1].replace("https://drive.google.com/file/d/", "").replace("/view?usp=sharing", "");

        promises.push(
            new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    console.log("Image Loaded");
                    resolve({ img, row: row[0], index });
                };
                img.src = imageLink;
                img.id = "profile";
            })
        );
        index++;
    });
    Promise.all(promises).then((outputs) => {
        var array = Array.apply(null, Array(index + 1)).map(() => {});
        for (output in outputs) {
            array[outputs[output].index] = outputs[output];
        }
        for (output in array) {
            var image = outputs[output]["img"];
            var name = outputs[output]["row"];
            if(name.length>20){lineResize()}
            document.querySelector(".name").innerHTML = name;
            document.querySelector("#profile").parentNode.replaceChild(image, document.querySelector("#profile"));
            window.print();
        }
    });
    console.log(promises);
}
function lineResize(){
    document.querySelector("#profile").style = 'height: 160px;';
    logoBottom.style = 'height: 110px;';
    document.querySelector(".name").style = 'font-size: 26px;';
    console.log('resized due to long name')
}
document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metakey) && e.keyCode === 80) {
        e.preventDefault();
        printBadges();
    }
});

// Add persistence across reloads
changeBg();
changeBorder();
changeTextColor();
