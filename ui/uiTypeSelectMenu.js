// 导入模块
let imgProc = require(files.cwd() + "/js/imgProc.js");
let uiTSMItem = require("./uiTSMItem.js")

// 图片处理类型选择根菜单点击事件
ui.imgProcTypeSelectRootMenu.on("click", function(view) {
    return imgProcTypeSelectRootMenu.click(view);

});

// 长按事件
ui.imgProcTypeSelectRootMenu.setOnLongClickListener(function(view) {
    return imgProcTypeSelectRootMenu.longClick(view);

})


function imgProcTypeSelectRootMenu() {}
// 图片处理类型选择根菜单被点击
imgProcTypeSelectRootMenu.click = function(view, indexDictList) {
    // 弹出菜单
    let popupMenu = new PopupMenu(activity, view);

    // 菜单项目
    let menuDict = indexDictList;
    if (!menuDict) {
        menuDict = uiTSMItem.getMenuItemList();

    }

    let menuList = Object.keys(menuDict);

    // 赋值菜单栏项目
    let menu = popupMenu.getMenu();

    // 选项标注
    if (optionsMarking) {
        menuList = imgProcTypeSelectRootMenu.optionsMarking(menuDict, menuList);

    }
    for (let i = 0; i < menuList.length; i++) {
        menu.add(menuList[i]);

    }

    // 菜单栏项目点击事件
    popupMenu.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener({
        onMenuItemClick: function(item) {
            return imgProcTypeSelectRootMenu.menuItemClick(view, item, menuDict);

        }

    }))


    // 弹出菜单栏
    popupMenu.show();

    return 0;

};

// 图片处理类型选择根菜单被长按
imgProcTypeSelectRootMenu.longClick = function(view, indexDictList) {
    // 菜单项目
    let menuDict = indexDictList;
    if (!menuDict) {
        menuDict = uiTSMItem.getMenuItemList();

    }

    let menuList = Object.keys(menuDict);

    let items = menuList;

    // 选项标注
    if (optionsMarking) {
        items = imgProcTypeSelectRootMenu.optionsMarking(menuDict, menuList);

    }

    // 对话框
    let Dialog = new MaterialAlertDialogBuilder(activity);
    Dialog.setTitle("图像处理")
        .setItems(items, function(dialog, option) {
            let item = menuList[option];
            imgProcTypeSelectRootMenu.menuItemClick(view, item, menuDict, true);

        })

    Dialog.show();

    return true;
}


// 菜单栏项目被点击事件
imgProcTypeSelectRootMenu.menuItemClick = function(view, item, menuDict, longClick) {
    // 赋值真正的 item 文本
    item = String(item).split(" (")[0];
    
    // view初始化
    view.setText(String(item));

    /* 变量初始化 */
    // 控件
    let mainFlowLayout = ui.imgProcTypeSelectMainLayout;
    let parentView = ui.imgProcTypeSelectLayout;

    // 数据
    let information = ObjDict.getIndexAt(menuDict, 0);
    let mainMenuDict = menuDict[item];
    let mainInformation = mainMenuDict;
    if (item != ObjDict.getKeyAt(mainInformation, 0)) {
        mainInformation = ObjDict.getIndexAt(mainInformation, 0);

    }
    let cvProcData = {};

    /* 变量初始化 */
    // 删除其他所有子控件
    imgProcTypeSelectRootMenu.removeOtherAll(mainFlowLayout, information["index"] + 1);

    // 菜单栏结束判断
    let state = information["mainState"];
    if (mainMenuDict["state"] != undefined) {
        state = mainMenuDict["state"];

    }

    if (state) {
        // cvProc
        let cvProc = mainMenuDict["cvProc"];

        // valueDict
        let valueDict = information["mainValueDict"]
        if (mainMenuDict["valueDict"] != undefined) {
            valueDict = mainMenuDict["valueDict"];

        }

        // 指定 OpenCV 处理
        function cvProcButton() {
            // 文本控件
            let text = imgProcTypeSelectRootMenu.getTextUi(parentView);

            // 按钮控件
            let button = imgProcTypeSelectRootMenu.getMenuUi(parentView);

            // 控件属性赋值
            text.setText(cvProc);

            // 文本长按事件
            text.setOnLongClickListener(function(view) {
                // 选项标注
                if (optionsMarking) {
                    // 关闭选项标注
                    optionsMarking = false;
                    toast("成功关闭选项标注");

                } else {
                    // 开启选项标注
                    optionsMarking = true;
                    toast("成功开启选项标注");

                }

                storage.put("optionsMarking", optionsMarking);

                return true;
            })

            button.setText("确认");

            // 按钮点击事件
            button.on("click", (view) => {
                // 设置按钮为不可点击
                view.setEnabled(false);

                // OpenCV 图像处理
                if (cvProc) {
                    let boor = imgProc.cvProc(
                        String(cvProc),
                        cvProcData, {
                            "select": true

                        }
                    )

                    if (boor) {
                        toast("处理成功: " + cvProc);

                    }

                }

                setTimeout(function() {
                    // 设置按钮为可点击
                    view.setEnabled(true);
                    return true;

                }, 0)

            })

            // 按钮长按事件
            button.setOnLongClickListener(function(view) {
                if (valueDict) {
                    // 自动确认
                    if (autoConfirm) {
                        // 关闭自动确认
                        autoConfirm = false;
                        toast("成功关闭自动确认")

                    } else {
                        // 开启自动确认
                        autoConfirm = true;
                        toast("成功开启自动确认")

                    };

                    // 储存
                    storage.put("autoConfirm", autoConfirm);


                } else {
                    if (!imgProc.scecifiedNumCvProc.interrupt()) {
                        toast("停止");
                        setImgIndexText(imgIndex, imgList);
                        return true;
                    }

                    // 指定次数 OpenCV 图像处理
                    if (cvProc) {
                        let DialogLayout = ui.inflate(files.read("res/layout/activity_Dialog_Input.xml"));

                        // delay 输入
                        let delayInput = getInputUi(DialogLayout, `margin = "20 -20 0 0"`);
                        delayInput.InputLayout.attr("helperText", "等待时间 (ms)");
                        delayInput.InputEditText.attr("inputType", "number");
                        delayInput.InputEditText.attr("hint", "0");
                        DialogLayout.LinearLayout.addView(delayInput);

                        // 执行次数 输入
                        DialogLayout.InputLayout.attr("helperText", "执行次数");
                        DialogLayout.InputEditText.attr("inputType", "number");
                        let defaultValue = imgListMaxNum - 1;
                        DialogLayout.InputEditText.attr("hint", String(defaultValue));

                        function perform(num) {
                            let delay = Number(delayInput.InputEditText.getText());

                            imgProc.scecifiedNumCvProc(cvProc, cvProcData, num, delay, {
                                "toast": true,
                                "storage": true,
                                "select": true
                            });
                            imgProc.cvProc(cvProc, cvProcData, {
                                "storage": true,
                                "show": true,
                                "select": true
                            })
                            return true;
                        }

                        let Dialog = new MaterialAlertDialogBuilder(activity);
                        Dialog.setTitle("设置执行次数")
                            .setView(DialogLayout)

                            // 确定
                            .setPositiveButton("执行", function(view, type) {
                                let numText = DialogLayout.InputEditText.getText();
                                let num = Number(numText);

                                if (!num) {
                                    num = defaultValue;

                                };

                                perform(num);

                            })

                            // 取消
                            .setNegativeButton("取消", function(view, type) {
                                toast("取消");

                            })

                            // 默认
                            .setNeutralButton("最大", function() {
                                perform(imgListMaxNum - imgIndex - 1);

                            })


                        Dialog.show();


                    }
                }

                return true;

            })


            // 添加文本控件
            flowLayout.designatedAddView(mainFlowLayout, parentView, text, 1);

            // 添加按钮控件
            flowLayout.designatedAddView(mainFlowLayout, parentView, button, 1);
        }

        // OpenCV 图像处理
        if (cvProc) {
            cvProcButton();

        }

        if (valueDict) {
            // 刷新
            function refresh(slider, text, valueKey, other) {
                setCanvasRefreshBoor(false);
                if (!other) {
                    other = {};

                };
                let storageBoor = false;

                text.setText(`${valueKey}: ${slider.getValue().toFixed(valueFixedNum)}`);

                // OpenCV 图像处理数据赋值
                cvProcData[valueKey] = slider.getValue();

                // 自动确认
                if (autoConfirm) {
                    storageBoor = true;

                }

                // OpenCV 图像处理
                if (cvProc && other["cvProc"] != false) {
                    imgProc.cvProc(String(cvProc), cvProcData, {
                        "storage": storageBoor,
                        "select": other["select"],
                        "show": other["show"]
                    });

                }

                setCanvasRefreshBoor(true);
                return true;
            }

            let title = getTextUi(parentView, `margin = "0 15 0 0"`);
            title.setText("数值调节")
            // 数值调节被长按
            title.setOnLongClickListener(function(view) {
                let DialogLayout = ui.inflate(files.read("res/layout/activity_Dialog_Input.xml"));
                // 刷新间隔输入
                DialogLayout.InputLayout.attr("helperText", "图片更改间隔 (ms)");
                DialogLayout.InputEditText.attr("inputType", "numberDecimal");
                let imgChangeIntervalNum = imgChangeInterval;
                DialogLayout.InputEditText.attr("hint", imgChangeIntervalNum);
                
                // 数值调节固定位数
                let valueAdjFixedLayout = getInputUi(DialogLayout, `margin = "20 -20 20 20"`);
                
                valueAdjFixedLayout.InputLayout.attr("helperText", "数值调节固定位数");
                valueAdjFixedLayout.InputEditText.attr("inputType", "number");
                valueAdjFixedLayout.InputEditText.attr("hint", valueFixedNum);
                
                DialogLayout.addView(valueAdjFixedLayout);
                
                let Dialog = new MaterialAlertDialogBuilder(activity);
                Dialog.setTitle("数值调节设置")
                    .setView(DialogLayout)

                    // 确定
                    .setPositiveButton("确认", function(view, type) {
                        if (DialogLayout.InputEditText.getText() != "") {
                            imgChangeIntervalNum = Number(DialogLayout.InputEditText.getText());

                        }
                        // imgChangeInterval = imgChangeIntervalNum;
                        
                        if (valueAdjFixedLayout.InputEditText.getText() != "") {
                            valueFixedNum = valueAdjFixedLayout.InputEditText.getText();

                        }
                        
                        // 储存
                        storage.put("imgChangeInterval", imgChangeInterval);
                        storage.put("valueFixedNum", valueFixedNum);
                        
                        toast("更改成功。更改显示方面的不会立即生效, 需要刷新一次");
                    })

                    // 取消
                    .setNegativeButton("取消", function(view, type) {
                        toast("取消");

                    })

                    // 默认
                    .setNeutralButton("默认", function(view) {
                        imgChangeInterval = 0;

                        // 储存
                        storage.put("imgChangeInterval", imgChangeInterval);

                        toast("成功恢复默认");
                    })


                Dialog.show();


                return true;
            })

            flowLayout.designatedAddView(mainFlowLayout, parentView, title, 1);

            let valueKeyList = Object.keys(valueDict);
            for (let i = 0; i < valueKeyList.length; i++) {
                let valueKey = valueKeyList[i];
                let valueList = valueDict[valueKey];

                // 滑动条赋值
                let slider = getSliderUi(parentView, `margin = "5 5 5 0"`);
                slider.setValue(valueList["value"]);
                slider.setValueFrom(valueList["valueFrom"]);
                slider.setValueTo(valueList["valueTo"]);
                slider.setStepSize(valueList["stepSize"]);

                // 文本赋值
                let text = getTextUi(parentView);

                // 刷新
                refresh(slider, text, valueKey, {
                    "cvProc": false
                });

                // 控件检测
                // slider 滑动检测
                let sliderChange = 0;
                slider.addOnChangeListener({
                    onValueChange: function(view, value, fromUser) {
                        if (sliderChange == 0) {
                            sliderChange = 1;

                        } else {
                            return true;

                        }

                        refresh(view, text, valueKey);
                        setTimeout(function() {
                            sliderChange = 0;
                            return true;

                        }, imgChangeInterval);

                    }

                })

                // slider 活动 开始/结束 监听
                slider.addOnSliderTouchListener({
                    // 滑动开始
                    onStartTrackingTouch: function(view) {


                    },
                    // 滑动结束
                    onStopTrackingTouch: function(view) {
                        // 刷新
                        refresh(view, text, valueKey, {
                            "show": true
                        });

                    }
                });


                // 文本 点击事件
                text.setOnClickListener(function(view) {
                    // 信息提示框
                    toast("请勿乱调整数值，可能会导致程序崩溃");
                    
                    let fixed = 5;
                    
                    // 数值
                    let num = slider.getValue().toFixed(valueFixedNum);
                    let DialogLayout = ui.inflate(files.read("res/layout/activity_Dialog_Input.xml"));
                    DialogLayout.InputLayout.attr("helperText", "当前值");
                    DialogLayout.InputEditText.attr("inputType", "numberDecimal");
                    DialogLayout.InputEditText.attr("hint", num);

                    // 最小值
                    let minNum = slider.getValueFrom().toFixed(valueFixedNum);
                    let minNumLayout = getInputUi(DialogLayout, `margin = "20 -25 20 0"`);
                    minNumLayout.InputLayout.attr("helperText", "最小值");
                    minNumLayout.InputEditText.attr("inputType", "numberDecimal");
                    minNumLayout.InputEditText.attr("hint", minNum);

                    DialogLayout.addView(minNumLayout)

                    // 最大值
                    let maxNum = slider.getValueTo().toFixed(valueFixedNum);
                    let maxNumLayout = getInputUi(DialogLayout, `margin = "20 -5 20 0"`);
                    maxNumLayout.InputLayout.attr("helperText", "最大值");
                    maxNumLayout.InputEditText.attr("inputType", "numberDecimal");
                    maxNumLayout.InputEditText.attr("hint", maxNum);

                    DialogLayout.addView(maxNumLayout);

                    // 步长
                    let stepSizeNum = slider.getStepSize().toFixed(valueFixedNum);
                    let stepSizeNumLayout = getInputUi(DialogLayout, `margin = "20 -5 20 0"`);
                    stepSizeNumLayout.InputLayout.attr("helperText", "步长");
                    stepSizeNumLayout.InputEditText.attr("inputType", "numberDecimal");
                    stepSizeNumLayout.InputEditText.attr("hint", stepSizeNum);

                    DialogLayout.addView(stepSizeNumLayout);

                    // 设置滑动条
                    function setSlider() {
                        slider.setValue(num);
                        slider.setValueFrom(minNum);
                        slider.setValueTo(maxNum);
                        slider.setStepSize(stepSizeNum);

                    }


                    let Dialog = new MaterialAlertDialogBuilder(activity);
                    Dialog.setTitle("滑动条设置")
                        .setView(DialogLayout)

                        // 确定
                        .setPositiveButton("确定", function(view, type) {
                            // 当前值
                            if (DialogLayout.InputEditText.getText() != "") {
                                num = Number(DialogLayout.InputEditText.getText());

                            }

                            // 最小值
                            if (minNumLayout.InputEditText.getText() != "") {
                                minNum = Number(minNumLayout.InputEditText.getText());

                            }

                            // 最大值
                            if (maxNumLayout.InputEditText.getText() != "") {
                                maxNum = maxNumLayout.InputEditText.getText();

                            }
                            if (num > slider.getValueTo()) {
                                maxNum = num;

                            }

                            // 步长
                            if (stepSizeNumLayout.InputEditText.getText() != "") {
                                stepSizeNum = stepSizeNumLayout.InputEditText.getText();

                            }


                            setSlider();

                        })

                        // 取消
                        .setNegativeButton("取消", function(view, type) {
                            toast("取消");

                        })

                        // 默认
                        .setNeutralButton("默认", function(view) {
                            num = valueList["value"];
                            minNum = valueList["valueFrom"];
                            maxNum = valueList["valueTo"];
                            setSlider();

                        })


                    Dialog.show();

                })

                // 添加滑动条到布局
                flowLayout.designatedAddView(mainFlowLayout, parentView, slider, 1);

                // 添加文本到布局
                flowLayout.designatedAddView(mainFlowLayout, parentView, text, 1);

            }

        };

        return false;

    }

    // 布局赋值
    let min = flowLayout.getChildCount(mainFlowLayout);
    let max = information["mainIndex"]
    if (mainMenuDict["state"] != undefined) {
        max = mainMenuDict["state"];
    }
    // 成功又解决一个bug，wow 2026-1-16 23:29 50

    if (mainInformation["index"] != undefined) {
        max = mainInformation["index"];

    }
    for (let i = min; i <= max; i++) {
        // 控件布局
        let controls = imgProcTypeSelectRootMenu.getMenuUi(parentView);

        // 控件属性赋值
        controls.setText("无");

        if (i != max) {
            controls.setVisibility(View.INVISIBLE);

        } else {
            // 控件点击事件
            controls.on("click", (view) => {
                let indexDictList = mainMenuDict;
                imgProcTypeSelectRootMenu.click(view, indexDictList);

            });

            // 控件长按事件
            controls.setOnLongClickListener(function(view) {
                let indexDictList = mainMenuDict;
                imgProcTypeSelectRootMenu.longClick(view, indexDictList);

                return true;
            })

            if (!state && longClick) {
                imgProcTypeSelectRootMenu.longClick(controls, mainMenuDict);

            }

        };

        // 添加控件到布局
        flowLayout.designatedAddView(mainFlowLayout, parentView, controls, 3)

    };

    return false;

};


// 获取菜单ui
imgProcTypeSelectRootMenu.getMenuUi = function(view) {
    return ui.inflate(`
        <com.google.android.material.button.MaterialButton
            android:text = "null"
            android:layout_width = "wrap_content"
            android:layout_height = "wrap_content"
            
            margin = "0 0 5 0"
            
            />`, view);

};

// 获取文本ui
imgProcTypeSelectRootMenu.getTextUi = function(view) {
    return ui.inflate(`
        <com.google.android.material.textview.MaterialTextView
            android:text = "null"
            android:layout_width = "wrap_content"
            android:layout_height = "wrap_content"
            
            margin = "5 0 0 5"
            
        />
        
    `, view)

}

// 删除其他所有子控件
imgProcTypeSelectRootMenu.removeOtherAll = function(view, num) {
    return flowLayout.removeOtherAll(view, num);

};

// 选项标注
imgProcTypeSelectRootMenu.optionsMarking = function(menuDict, menuList) {
    let items = [];
    for (let i = 0; i < menuList.length; i++) {
        let text = menuList[i];

        let dict = menuDict[Object.keys(menuDict)[i]];
        if (dict && dict["cvProc"]) {
            text += " (" + String(dict["cvProc"]) + ")";

        };

        items.push(text);

    };

    return items;
}


module.exports = this;