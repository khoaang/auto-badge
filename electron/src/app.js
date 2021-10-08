aroundOption = document.querySelector("#around-option");
centerOption = document.querySelector("#center-option");
evenlyOption = document.querySelector("#evenly-option");

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
rightBtn = document.querySelector(".rightBtn");
leftBtn = document.querySelector(".leftBtn");
badgeCounter = document.querySelector(".badge-counter");

var nonPrintImages = {};

var constImages;

var modalBody = document.querySelector(".modal-body");
var checkboxElement = document.querySelector(".modal-check");
var modal = document.querySelector("#badgeModal");

var images = [];
var currentImageIndex = null;

var spreadsheet = [];
var currentSpacing = "justify-content-between";
const badgeWrapper = document.querySelector(".content-wrapper");


document.querySelector(".year").innerHTML = `${new Date().getFullYear()}-${new Date().getFullYear()+1}`
const changeSpacing = () => {
    badgeWrapper.classList.remove(currentSpacing);
    if (evenlyOption.checked) {
        currentSpacing = "justify-content-evenly";
    } else if (aroundOption.checked) {
        currentSpacing = "justify-content-around";
    } else if (centerOption.checked) {
        currentSpacing = "justify-content-center";
    }
    console.log(currentSpacing);
    badgeWrapper.classList.add(currentSpacing);
};

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
    logoBottom.classList.remove("d-none");
    document.querySelector(".logo-bottom").style = "display: block;";
}

function goToImage(index) {
    if (index < 0) {
        index = images.length - 1;
    }
    if (index > images.length - 1) {
        index = 0;
    }
    currentImageIndex = index;
    badgeCounter.innerHTML = currentImageIndex + 1 + "/" + images.length;
    var image = images[index]["img"];
    var name = images[index]["row"];
    if (name.length > 20) {
        lineResize();
    }
    document.querySelector(".name").innerHTML = name;
    document.querySelector("#profile").parentNode.replaceChild(image, document.querySelector("#profile"));
}

function getImages() {
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

        constImages = outputs;
        images = outputs;

        //load first image
        goToImage(0);
        badgeCounter.innerHTML = currentImageIndex + 1 + "/" + images.length;

        //load into modal
        for (image in images) {
            var checkbox = checkboxElement.cloneNode(true);
            console.log(checkbox);
            console.log(images[image]["row"]);

            checkbox.id = image;

            checkbox.childNodes[3].firstChild.textContent = images[image]["row"];

            modalBody.append(checkbox);
        }
        checkboxElement.hidden = true;
    });
}
uploaded = false;
function uploadSpreadsheet() {
    if(uploaded){location.reload();}
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
        getImages();
    };
}
const changeGradient = () => {
    gradientTop = document.getElementById("gradient-top").value;
    gradientBottom = document.getElementById("gradient-bottom").value;
    background = `background-image: linear-gradient(${gradientTop}, ${gradientBottom});`;
    changeStyling();
};
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
    console.log(background);
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

function fart (x){
    const ipc = require("electron").ipcRenderer;
    goToImage(x);
    ipc.send("silent-print", "print");
    console.log("Print request sent");
    ipc.once("silent-print-response", () => {
        if(!(x+1 > images.length - 1)){
            console.log("Going to next badge", x+1);
            setTimeout(function(){
                fart(x+1);
            }, 500)
        }
        else{
            document.body.classList.remove("printStyles");
        }
    });
}

function printBadges() {
    if (window.require) {
        console.log("Running in Electron");
        document.body.classList.add("printStyles");
        fart(0)
    } else {
        console.warn("App not running inside Electron!");
        for (image in images) {
            goToImage(image);
            window.print();
        }
    }
}
function lineResize() {
    document.querySelector(".name").style = "font-size: 26px;";
    console.log("resized due to long name");
}
document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metakey) && e.keyCode === 80) {
        e.preventDefault();
        printBadges();
    }
});
function arrowClick(arrow) {
    switch (arrow) {
        case "right":
            {
                console.log("right");
                goToImage(currentImageIndex + 1);
            }
            break;
        case "left":
            {
                console.log("left");
                goToImage(currentImageIndex - 1);
            }
            break;

        default:
            break;
    }
}

function uncheckAll() {
    var badgeBoxes = document.getElementsByClassName("badge-check");
    var array = [...badgeBoxes];
    for (badgeBox in array) {
        var badgeId = badgeBox;
        badgeBox = array[badgeBox];
        badgeBox.checked = false;
    }
}

function checkAll() {
    var badgeBoxes = document.getElementsByClassName("badge-check");
    var array = [...badgeBoxes];
    for (badgeBox in array) {
        var badgeId = badgeBox;
        badgeBox = array[badgeBox];
        badgeBox.checked = true;
    }
}

function saveBadges() {
    var badgeBoxes = document.getElementsByClassName("badge-check");
    var array = [...badgeBoxes];
    // console.log(array);
    array.splice(0, 1);
    for (badgeBox in array) {
        var badgeId = badgeBox;
        badgeBox = array[badgeBox];
        // console.log(badgeId, badgeBox.checked);
        if (!badgeBox.checked && images.includes(constImages[badgeId])) {
            nonPrintImages[badgeId] = constImages[badgeId];
            images.splice(images.indexOf(constImages[badgeId]), 1);
            console.log(images.length);
        }
        if (badgeBox.checked && nonPrintImages[badgeId]) {
            images.push(nonPrintImages[badgeId]);
            console.log(images.length);
        }
    }
    // console.log(images);
}

function print() {
    if (window.require) {
        const ipc = require("electron").ipcRenderer;

        document.body.classList.add("printStyles");
        console.log("Running in Electron");
        require("electron").ipcRenderer.send("silent-print", "print");
        console.log("Print request sent");
        ipc.once("silent-print-response", () => {
            document.body.classList.remove("printStyles");
        })

        } else {
        console.warn("App not running inside Electron!");
        window.print();
    }
}

// Add persistence across reloads
changeBg();
changeBorder();
changeTextColor();
