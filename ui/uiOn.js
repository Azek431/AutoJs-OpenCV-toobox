// canvas 绘制
var paintImg = new Paint();

function canvasOn(canvas) {
    // 画板刷新
    canvas.on("draw", function(canvas) {
        // 画板是否启动刷新
        if (!canvasRefreshBoor) {

            return true;
        }

        canvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
        canvas.drawARGB(255, 255, 255, 255);

        let matrix = new Matrix();

        // 自适应
        let src = new RectF(0, 0, bitmapImg.getWidth(), bitmapImg.getHeight())
        let dst = new RectF(0, 0, canvas.getWidth(), canvas.getHeight());

        matrix.setRectToRect(src, dst, Matrix.ScaleToFit.CENTER);

        // 缩放
        ui.canvas.attr("scaleX", imgShowScale);
        ui.canvas.attr("scaleY", imgShowScale);

        canvas.drawBitmap(bitmapImg, matrix, paintImg);

        return true;
    })

    // 图片查看
    canvas.setOnLongClickListener(function(view) {
        app.viewFile(currentShowImgPath);

        return true;
    })

}
canvasOn(ui.canvas);

// 悬浮显示
ui.canvas.setOnClickListener(function() {
    threads.start(function() {
        let w = floaty.window(`
        <frame>
            <canvas
                id = "canvas"

            />
        </frame>
        `)

        // 属性赋值
        w.setSize(device.width * 0.68, device.width * 0.68);
        // w.setTouchable(false);
        sleep(100);
        w.setPosition((device.width - w.getWidth()) / 2, device.height * 0.134);
        w.setAdjustEnabled(!w.isAdjustEnabled());

        // 事件
        canvasOn(w.canvas);
        // w.setSize(-2, -2);

    })

})


// 选择图片
ui.selectImg.on("click", function() {
    let fileType = "image/*";
    var intent = new Intent();

    intent.setType(fileType);
    intent.setAction(Intent.ACTION_GET_CONTENT)
    activity.startActivityForResult(intent, 1);

})


// 接收图片
activity.getEventEmitter().on("activity_result", (requestCode, resultCode, data) => {
    try {
        // 图片uri
        imgUri = data.getData();
        ui.imgUriText.setText(String(imgUri));

        // bitmapImg
        let cr = context.getContentResolver();
        setBitmapImg(BitmapFactory.decodeStream(cr.openInputStream(imgUri)), {
            "storage": true,
            "select": true
        });

        // 文件路径
        imgPath = uriToFile(imgUri);
        ui.imgPathText.setText(imgPath);

    } catch (e) {
        console.error(e)

    }


});


// 保存图片
ui.saveImg.on("click", function(view) {
    let img = ImageWrapper.ofBitmap(bitmapImg);
    let src = currentImgPath;

    // 保存
    images.save(img, src, "jpg", 100);

    // 另存 ( 软件更新时使用, 不然软件更新当天选择的图片就会重置 ) -- 2026-1-24 21:43 27 新增 得等到2月份才能放假😭
    images.save(img, sdCurrentImgPath, "jpg", 100);
    storage.put("sdCurrentImgPath", sdCurrentImgPath);
    
    // 储存
    storage.put("imgUri", imgUri);
    storage.put("imgPath", imgPath);

    toast("保存成功: " + src);

})

// 图片另存为
ui.imgSaveAs.on("click", function() {
    let DialogLayout = ui.inflate(files.read("res/layout/activity_Dialog_Input.xml"));

    // 保存文件名
    let name = `图片${Date.now()}`

    // 图片格式
    let format = "jpg"
    let formatLayout = getInputUi(DialogLayout, `margin = "20 -30 0 0"`);
    formatLayout.InputLayout.attr("helperText", "图片格式");
    formatLayout.InputEditText.attr("inputType", "text");
    formatLayout.InputEditText.attr("hint", "jpg");
    DialogLayout.addView(formatLayout);

    // 图片质量
    let quality = 100;
    let qualityLayout = getInputUi(DialogLayout, `margin = "20 0 0 0"`);
    qualityLayout.InputLayout.attr("helperText", "图片质量 (0 ~ 100)");
    qualityLayout.InputEditText.attr("inputType", "number");
    qualityLayout.InputEditText.attr("hint", quality)

    DialogLayout.addView(qualityLayout);

    // 文件名
    DialogLayout.InputLayout.attr("helperText", "文件名");
    DialogLayout.InputEditText.attr("inputType", "text");
    DialogLayout.InputEditText.attr("hint", name);

    // 保存
    let path;

    function save() {
        // 文件名
        if (DialogLayout.InputEditText.getText() != "") {
            name = DialogLayout.InputEditText.getText();

        }

        // 图片格式
        if (formatLayout.InputEditText.getText() != "") {
            format = formatLayout.InputEditText.getText();

        }

        // 图片质量
        if (qualityLayout.InputEditText.getText() != "") {
            quality = Number(qualityLayout.InputEditText.getText());

        }

        // 创建文件夹
        files.create(initImgSaveAsPath)
        path = `${initImgSaveAsPath}${name}.${format}`

        images.save(img, path, format, quality);
        toast(`已成功保存到: ${path}`);

    }

    let Dialog = new MaterialAlertDialogBuilder(activity);
    Dialog.setTitle("图片另存为")
        .setView(DialogLayout)

        // 保存
        .setPositiveButton("保存", function(view, type) {
            save();

        })

        // 取消
        .setNegativeButton("查看", function(view, type) {
            save();
            app.viewFile(path);

        })

        // 保存并编辑
        .setNeutralButton("保存并编辑", function() {
            save();
            app.editFile(path);

        })


    Dialog.show();

})

// 使用内置图片
ui.useInitImg.on("click", function() {
    let dir = "./src/"
    imgPath = dir + random.choice(files.listDir(dir));
    ui.imgPathText.setText(imgPath);

    let img = images.read(imgPath);
    setImgValue(img, {
        "storage": true,
        "select": true

    });

    // 信息提示框
    toast("成功使用初始图片: " + imgPath);
})



// 设置图片另存位置
// 原按钮 (setImgSaveAsPath) 换为 另存为 长按 -- 2026-1-24 13:06 21
ui.imgSaveAs.setOnLongClickListener(function(view) {
    let DiaLogLayout = ui.inflate(files.read("res/layout/activity_Dialog_imgSaveAsSet.xml"));

    DiaLogLayout.inputText.attr("hint", initImgSaveAsPath);
    DiaLogLayout.inputText.setText(initImgSaveAsPath);

    let Dialog = new MaterialAlertDialogBuilder(activity);
    Dialog.setTitle("设置另存位置")
        .setView(DiaLogLayout)

        // 确定
        .setPositiveButton("确定", function(dialog) {
            let path = String(DiaLogLayout.inputText.getText());
            if (path && path != "") {
                // 首位添加/
                if (path[0] != "/") {
                    path = "/" + path;

                }

                // 末尾添加/
                if (path.slice(-1) != "/") {
                    path = path + "/";

                }
                
                // 另存路径
                initImgSaveAsPath = path;
                storage.put("initImgSaveAsPath", initImgSaveAsPath);

                // sd卡当前图片另存图片路径
                sdCurrentImgPath = `${initImgSaveAsPath}${currentImgName}.jpg`

                toast("设置成功: " + initImgSaveAsPath);

            }
        })

        // 取消
        .setNegativeButton("取消", function(dialog) {
            toast("取消");

        })

        // 默认
        .setNeutralButton("默认", function() {
            initImgSaveAsPath = "/storage/emulated/0/Pictures/OpenCV-工具箱/";
            storage.put("initImgSaveAsPath", initImgSaveAsPath);
            // sd卡当前图片另存图片路径

            sdCurrentImgPath = `${initImgSaveAsPath}${currentImgName}.jpg`

            toast("已成功恢复默认: " + initImgSaveAsPath);

        })
        .show();

    // 返回
    return true;
})


// 滑动条变化
ui.scaleSlider.addOnChangeListener({
    onValueChange: (view, value, fromUser) => {
        imgShowScale = value;
        storage.put("imgShowScale", imgShowScale);
        ui.scaleText.setText("缩放: " + value.toFixed(2));

    },
});

// 类型选择菜单
require("./uiTypeSelectMenu.js");


// 图片恢复
ui.imgRecov.on("click", function() {
    let path = currentImgPath;
    setBitmapImg(images.read(path).bitmap);

    toast("恢复成功: " + path);

})

// 撤销图片
ui.lastImg.on("click", function(view) {
    // 设置重做为可点击
    ui.nextImg.setEnabled(true);

    // 判断为第一
    if (imgIndex > 1) {
        imgIndex -= 1;

    } else {
        // 设置当前为不可点击
        imgIndex = 0;
        view.setEnabled(false);

    }
    setImgValue(imgList[imgIndex], {
        "storage": false,
        "show": true
    });

    setImgIndexText(imgIndex, imgList);

});


// 图片重做
ui.nextImg.on("click", function(view) {
    // 设置撤销为可点击
    ui.lastImg.setEnabled(true);
    random()

    // 判断为最后
    if (imgIndex < imgList.length - 1) {
        imgIndex += 1;

    } else {
        // 设置当前为不可点击
        imgIndex = imgList.length - 1;
        view.setEnabled(false);

    }
    setImgValue(imgList[imgIndex], {
        "storage": false,
        "show": true
    });

    setImgIndexText(imgIndex, imgList);

});

// 一键清空图片列表
ui.imgRecov.setOnLongClickListener(function(view) {
    // 设置图片选择索引
    setImgIndexNum(-1);

    // 清空图片列表
    setImgList([img]);
    setImgIndexNum(0, {
        "select": true,
        "show": true
    });
    setImgIndexText(imgIndex, imgList);

    return true;
})

// 一键撤销
ui.lastImg.setOnLongClickListener(function(view) {
    // 设置当前 view 为不可点击
    view.setEnabled(false);

    // 设置 重置 为可点击
    ui.nextImg.setEnabled(true);

    setImgIndexNum(0);
    setImgIndexText(imgIndex, imgList);

    return true;
});

// 一键重做
ui.nextImg.setOnLongClickListener(function(view) {
    // 设置当前 view 为不可点击
    view.setEnabled(false);

    // 设置 撤销 为可点击
    ui.lastImg.setEnabled(true);

    setImgIndexNum(imgList.length - 1);
    setImgIndexText(imgIndex, imgList);

    return true;
})


// 图片索引文本控件被点击
ui.imgIndexText.on("click", function(view) {
    let DialogLayout = ui.inflate(files.read("res/layout/activity_Dialog_Input.xml"));
    DialogLayout.InputLayout.attr("helperText", "数值");
    DialogLayout.InputEditText.attr("inputType", "number");
    DialogLayout.InputEditText.attr("hint", String(imgIndex + 1));


    let Dialog = new MaterialAlertDialogBuilder(activity);
    Dialog.setTitle("设置当前值")
        .setView(DialogLayout)

        // 确定
        .setPositiveButton("确定", function(view, type) {
            let numText = DialogLayout.InputEditText.getText();

            if (numText != "") {
                setImgIndexNum(Number(numText) - 1, {
                    "select": true
                });
                setImgIndexText(imgIndex, imgList);

            }

            toast("成功将当前值设置为: " + (imgIndex + 1));

        })

        // 取消
        .setNegativeButton("取消", function(view, type) {
            toast("取消");

        })

        // 最大
        .setNeutralButton("最大", function(view) {
            setImgIndexNum(imgList.length - 1);
            toast("已成功设置为最大: " + (imgIndex + 1));

        })


    Dialog.show();


})

// 图片索引文本控件长按
ui.imgIndexText.setOnLongClickListener(function(view) {
    let DialogLayout = ui.inflate(files.read("res/layout/activity_Dialog_Input.xml"));
    DialogLayout.InputLayout.attr("helperText", "数值");
    DialogLayout.InputEditText.attr("inputType", "number");
    DialogLayout.InputEditText.attr("hint", String(imgListMaxNum));


    let Dialog = new MaterialAlertDialogBuilder(activity);
    Dialog.setTitle("设置最大值")
        .setView(DialogLayout)

        // 确定
        .setPositiveButton("确定", function(view, type) {
            let numText = DialogLayout.InputEditText.getText();

            if (numText != "") {
                setImgListMaxNum(numText);

            }
            toast("成功将最大值设置为: " + imgListMaxNum);

        })

        // 取消
        .setNegativeButton("取消", function(view, type) {
            toast("取消");

        })

        // 默认
        .setNeutralButton("默认", function() {
            setImgListMaxNum(30);
            toast("已成功恢复默认: " + imgListMaxNum);

        })


    Dialog.show();


    return true;
})

ui.scaleSlider.addOnChangeListener({
    onValueChange: (slider, value, fromUser) => {
        imgShowScale = value;
        storage.put("imgShowScale", imgShowScale);
        ui.scaleText.setText("缩放: " + value.toFixed(2));

    },
});

// 图片索引 Slider 滑动
ui.imgIndexSlider.addOnChangeListener({
    onValueChange: (view, value, fromUser) => {
        // 赋值
        setImgIndexNum(value - 1, {
            "storage": false
        });
        setImgIndexText(imgIndex, imgList);

        // 撤销、重置 按钮可点击设置
        // 撤销
        if (value <= 1) {
            // 设置 撤销 为不可点击
            ui.lastImg.setEnabled(false);
            return true;
        }

        // 重置
        if (value >= imgList.length) {
            // 设置 重置 为不可点击
            ui.nextImg.setEnabled(false);
            return true;
        }

        // 其他情况
        // 设置 撤销、重置 均为可点击
        ui.lastImg.setEnabled(true);
        ui.nextImg.setEnabled(true);
        return true;

    }

})

// 图片 slider 活动 开始/结束 监听
ui.imgIndexSlider.addOnSliderTouchListener({
    // 滑动开始
    onStartTrackingTouch: function(view) {


    },
    // 滑动结束
    onStopTrackingTouch: function(view) {
        // 赋值
        setImgIndexNum(view.getValue() - 1, {
            "select": true,
            "show": true
        });
        setImgIndexText(imgIndex, imgList);


    }
});


// 复制当前选择图片路径
ui.imgPathText.setOnClickListener(function(view) {
    setClip(view.getText());
    toast(`已成功复制到剪贴板: ${view.getText()}`)

    return true;
})

// 查看当前选择图片目录
ui.imgPathText.setOnLongClickListener(function(view) {
    app.viewFile(imgPath);
    toast(`查看: ${imgPath}`);

    return true;
})