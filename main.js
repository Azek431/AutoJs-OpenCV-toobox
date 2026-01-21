/* OpenCV-工具箱 */
"ui";
/*
作者: Act
qq: 2982154038
Pro 9.3.11
*/

/* 导入模块 */
// 初始化类
const initClass = require("./initClass.js");
initClass.init();


// ui
let androidx = Packages.androidx;
let ActionBarDrawerToggle = androidx.appcompat.app.ActionBarDrawerToggle;
let MaterialColors = com.google.android.material.color.MaterialColors;

require("./ui/uiInit.js")


/* 初始化变量 */
// 储存
var storage = storages.create("OpenCV-工具箱");


// 画板刷新 boor ( 如果值为假，则画板不刷新 2026-1-19 15:51 23 新增 今天下雪不上学好开心呀（＞ｙ＜） )
var canvasRefreshBoor = true;


// 图片
var initImgSrc = "./src/apple.jpg";

// 创建缓存文件夹
files.create("./temp/");


var currentImgPath = "./temp/当前图片.jpg";
var img = images.read(currentImgPath);
if (!img) {
    img = initImg();

}

// bitmap 图片
var bitmapImg = img.bitmap;

// 图片列表
var imgList = [];
var imgIndex = 0;

// 当前显示图片路径
var currentShowImgPath = "./temp/当前显示图片.jpg";

// 当前选择图片
var currentSelectImgPath = "./temp/当前选择图片.jpg";
setImgValue(img, {
    "select": true
});

// 图片路径
var imgUri = storage.get("imgUri");
ui.imgUriText.setVisibility(View.GONE);
var imgPath = storage.get("imgPath");
if (!imgPath) {
    imgPath = initImgSrc;

}
ui.imgPathText.setText(imgPath);

// 图片另存路径
var initImgSaveAsPath = storage.get("initImgSaveAsPath");
if (!initImgSaveAsPath) {
    initImgSaveAsPath = "/storage/emulated/0/Pictures/OpenCV-工具箱/"

}

// 图片显示旋转
var imgShowRotate = 0;

// 图片显示缩放
var imgShowScale = 0.8;
if (storage.get("imgShowScale")) {
    imgShowScale = storage.get("imgShowScale")

}
ui.scaleSlider.attr("value", imgShowScale);
ui.scaleText.setText("缩放: " + imgShowScale.toFixed(2));

// 选项标注
var optionsMarking = storage.get("optionsMarking");
if (optionsMarking == undefined) {
    optionsMarking = true;

}

// 自动确认 ( 2026-1-16 16:32 47 新增 )
var autoConfirm = storage.get("autoConfirm");
if (autoConfirm == undefined) {
    autoConfirm = false; // 初始值 --位于 2026-1-19 16:24 49 更改一次, 并修改了其功能定义

}

// 图片更改间隔 ( 2026-1-19 12:01 16 新增)
var imgChangeInterval = storage.get("imgChangeInterval");
if (imgChangeInterval == undefined) {
    imgChangeInterval = 31;

}


/* 初始化变量 */


/* 函数 (function) */
// 信息提示框 (toast)
var toastA;
toast = function(message) {
    if (toastA) {
        toast.dismiss();
        toastA = null;

    }

    toastA = Toast.makeText(context, String(message), Toast.LENGTH_LONG);
    toastA.show();


}

// 取消当前toast
toast.dismiss = function() {
    toastA.cancel();

}


// 初始图片
function initImg() {
    return images.read(initImgSrc);

}

// 设置 bitmap 图片
function setBitmapImg(bitmap, other) {
    let mat = new Mat();
    Utils.bitmapToMat(bitmap, mat);
    setImgValue(ImageWrapper.ofMat(mat), other);

}

// 设置图片
let imgListMaxNum = storage.get("imgListMaxNum");
if (!imgListMaxNum) {
    imgListMaxNum = 30;

}

function setImgListMaxNum(num) {
    imgListMaxNum = Number(num);
    storage.put("imgListMaxNum", imgListMaxNum);

}

// 以图片索引获取图片 --2026-1-20 17:26 12 新增。又停课了一天，已经停课三天了，好开心呀😊
function getImgIndex(num) {
    if (num >= 0 && num <= imgList.length) {
        return imgList[imgIndex];
    }
    if (num == -1) {
        // 恢复
        return images.read(currentImgPath);
    }

}

function setImgIndexNum(num, other) {
    if (!other) {
        other = {};

    }
    
    if (other["storage"] == undefined) {
        other["storage"] = false;

    }
    if (other["show"] == undefined) {
        other["show"] = true;
        
    }
    
    imgIndex = Number(num);
    
    // 保存
    let img = getImgIndex(num);
    setImgValue(img, other)

    return true;
}


function setImgValue(value, other) {
    if (!other) {
        other = {};

    }

    img = value;
    bitmapImg = img.bitmap;

    // 选择
    if (other["select"] == true) {
        // 保存文件 ( 当前选择图片 )
        images.save(img, currentSelectImgPath, "jpg", 100);

    }

    // 显示 --2026-1-19 16:42 33 新增
    if (other["show"] || other["storage"] != false) {
        // 保存文件 ( 当前显示图片 )
        images.save(img, currentShowImgPath, "jpg", 100);

    }

    // 储存
    if (other["storage"] != false) {
        imgList.push(img);

        if (imgList.length > imgListMaxNum) {
            for (let i = 0; i <= imgList.length - imgListMaxNum; i++) {
                imgList.splice(1, 1);

            }

        }
        imgIndex = imgList.length - 1;
        setImgIndexText(imgIndex, imgList);

        // 控件
        ui.lastImg.setEnabled(true);

        // 设置重置为不可点击
        ui.nextImg.setEnabled(false);

    }

    return true;
}

function setImgIndexText(imgIndex, imgList) {
    // 设置文本
    ui.imgIndexText.setText(String(imgIndex + 1) + " / " + imgList.length);

    // 设置 Slider 最大值
    ui.imgIndexSlider.setEnabled(false);
    ui.imgIndexSlider.setValueTo(imgList.length);

    // 设置 Slider 当前值
    if (imgIndex + 1 <= ui.imgIndexSlider.getValueTo()) {
        ui.imgIndexSlider.setValue(imgIndex + 1);

    }

    ui.imgIndexSlider.setEnabled(true);

}

// 赋值图片列表
function setImgList(list) {
    imgList = list;

    return true;
}

// 设置画板刷新boor
function setCanvasRefreshBoor(boor) {
    // 赋值
    canvasRefreshBoor = boor;

    // 返回
    return true;
}


// uri 转 file
function uriToFile(uri) {
    //Source : https://www.cnblogs.com/panhouye/archive/2017/04/23/6751710.html
    var r = null,
        cursor,
        column_index,
        selection = null,
        selectionArgs = null,
        isKitKat = android.os.Build.VERSION.SDK_INT >= 19,
        docs;
    if (uri.getScheme().equalsIgnoreCase("content")) {
        if (isKitKat && android.provider.DocumentsContract.isDocumentUri(activity, uri)) {
            if (String(uri.getAuthority()) == "com.android.externalstorage.documents") {
                docs = String(android.provider.DocumentsContract.getDocumentId(uri)).split(":");
                if (docs[0] == "primary") {
                    return android.os.Environment.getExternalStorageDirectory() + "/" + docs[1];
                }
            } else if (String(uri.getAuthority()) == "com.android.providers.downloads.documents") {
                uri = android.content.ContentUris.withAppendedId(
                    android.net.Uri.parse("content://downloads/public_downloads"),
                    parseInt(android.provider.DocumentsContract.getDocumentId(uri))
                );
            } else if (String(uri.getAuthority()) == "com.android.providers.media.documents") {
                docs = String(android.provider.DocumentsContract.getDocumentId(uri)).split(":");
                if (docs[0] == "image") {
                    uri = android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                } else if (docs[0] == "video") {
                    uri = android.provider.MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                } else if (docs[0] == "audio") {
                    uri = android.provider.MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                }
                selection = "_id=?";
                selectionArgs = [docs[1]];
            }
        }
        try {
            cursor = activity.getContentResolver().query(uri, ["_data"], selection, selectionArgs, null);
            if (cursor && cursor.moveToFirst()) {
                r = String(cursor.getString(cursor.getColumnIndexOrThrow("_data")));
            }
        } catch (e) {
            log(e);
        }
        if (cursor) cursor.close();
        return r;
    } else if (uri.getScheme().equalsIgnoreCase("file")) {
        return String(uri.getPath());
    }
    return null;
}



// 字典
function ObjDict() {};

// 字典 value 索引访问
ObjDict.getIndexAt = function(dict, index) {
    return dict[ObjDict.getKeyAt(dict, index)];

}

// 字典访问获取 key
ObjDict.getKeyAt = function(dict, index) {
    return Object.keys(dict)[index];

}


// 流水布局
function flowLayout() {};

// 获取子控件数量
flowLayout.getChildCount = function(view) {
    let num = 0;

    let max = view.getChildCount();
    for (let i = 0; i < max; i++) {
        num += view.getChildAt(i).getChildCount();

    }

    return num;

}

// 获取指定子控件
flowLayout.getChildAt = function(view, index) {
    let num = 0;
    let childList = [];

    let mainMax = view.getChildCount();
    for (let i = 0; i < mainMax; i++) {
        let childView = view.getChildAt(i);
        let max = childView.getChildCount();
        for (let ii = 0; ii < max; ii++) {
            childList.push(childView.getChildAt(ii));

            if (childView.length - 1 >= index) {
                return childList[index];

            }

        }

    }


}


// 指定 rowMax 流水布局添加 view
flowLayout.designatedAddView = function(flowView, parentView, newView, maxRowCount) {
    let endView = flowView.getChildAt(flowView.getChildCount() - 1);
    if (endView.getChildCount() >= maxRowCount) {
        let newLayout = ui.inflate(`
        <LinearLayout
            android:layout_width = "wrap_content"
            android:layout_height = "wrap_content"
            
            />`, flowView);


        newLayout.addView(newView);
        flowView.addView(newLayout);

    } else {
        endView.addView(newView);

    }

}

// 删除其他所有子控件
// wow，成功了！2826-1-16 23:19 35
flowLayout.removeOtherAll = function(flowView, index) {
    let sum = 0;
    for (let i = 0; i < flowView.getChildCount(); i++) {
        let childView = flowView.getChildAt(i);
        if (childView.getChildCount() == 0) {
            flowView.removeView(childView);
            i -= 1;

            continue;
        }

        for (let ii = 0; ii < childView.getChildCount(); ii++) {
            sum++;
            let view = childView.getChildAt(ii);
            if (sum > index) {
                childView.removeView(view);
                ii -= 1;

            }

        }

        if (childView.getChildCount() == 0) {
            flowView.removeView(childView);
            i -= 1;

        }

    }

}

// 获取输入框 ui
function getInputUi(view, property) {
    if (!property) {
        property = "";

    }

    return ui.inflate(`
        <com.google.android.material.textfield.TextInputLayout
            android:id = "@+id/InputLayout"
            android:layout_width = "match_parent"
            android:layout_height = "match_parent"
            app:hintEnabled="true"
            app:hintAnimationEnabled="true"
            app:helperText="helpText"
            app:helperTextEnabled="true"
            
            ${property}
        >
        
            <com.google.android.material.textfield.TextInputEditText
                android:id = "@+id/InputEditText"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="text"
                android:hint = "helpText"
                
            />
        
        </com.google.android.material.textfield.TextInputLayout>
    `, view);

}

// 获取 滑动条 (Slider) ui
function getSliderUi(view, property) {
    if (!property) {
        property = "";

    }

    return ui.inflate(`
        <com.google.android.material.slider.Slider
            android:id = "@+id/slider"
            android:stepSize = "0.01"
            android:valueFrom = "0"
            android:valueTo = "1.00"
            android:value = "0"
        
            ${property}
        />
        
        `, view);

}

// 获取文本ui
function getTextUi(view, property) {
    if (!property) {
        property = "";

    }

    return ui.inflate(`
        <com.google.android.material.textview.MaterialTextView
            android:id = "@+id/text"
            android:text = "null"
            
            ${property}
        />
        
    `, view)

}


/* 函数 (function) */


// ui Engines
require("./ui/uiOn.js");