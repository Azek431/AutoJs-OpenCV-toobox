// 获取菜单项目列表
function getMenuItemList() {
    /* 字典数据解析
        state: 状态 ( 0: 继续搜索, 1: 按钮, 2: 调节 )
        mainState: 一键改变状态
        
        index: 索引 ( 按钮菜单在网格布局中的位置 )，菜单按钮的索引。因为菜单栏列表是网格布局，有时候会出现控件不足的问题，所以增加索引即可
        mainIndex: 一键改变索引
        cvProc: OpenCV 图像处理码
        
        valueDict: 需要的值字典  {"key": [当前值, 最小值, 最大值, 步长] }
        mainValueDict: 一键改变子控件需要的值字典 --2026-1-19 16:12 48 新增, 好开心今天不要上学😆
        
        */

    // 基础变量
    let img = images.read(currentSelectImgPath);
    let imgWidth = img.getWidth();
    let imgHeight = img.getHeight();

    let currentImgIndex = imgIndex + 1;
    let currentMaxIndex = imgList.length;

    let canvasBasic = {
        "strokeWidth": {
            "value": 5,
            "valueFrom": 1,
            "valueTo": 20,
            "stepSize": 1

        },
        "图片选择": {
            "value": currentImgIndex,
            "valueFrom": 0,
            "valueTo": currentMaxIndex,
            "stepSize": 1

        }

    }

    let ksizeBasic = {
        "ksize": {
            "value": 3,
            "valueFrom": 0,
            "valueTo": 103,
            "stepSize": 1

        },
        "ksizeX": {
            "value": 0,
            "valueFrom": 0,
            "valueTo": 100,
            "stepSize": 1

        },
        "ksizeY": {
            "value": 0,
            "valueFrom": 0,
            "valueTo": 100,
            "stepSize": 1

        }

    }

    let ksizeOddNum = {
        "ksize": {
            "value": 3,
            "valueFrom": 0,
            "valueTo": 103,
            "stepSize": 1

        },
        "ksizeX": {
            "value": 0,
            "valueFrom": 0,
            "valueTo": 100,
            "stepSize": 1

        },
        "ksizeY": {
            "value": 0,
            "valueFrom": 0,
            "valueTo": 100,
            "stepSize": 1

        }

    }

    return {
        "无": {
            "state": 0,
            "index": 0

        },
        "图像变换": {
            "无": {
                "state": 0,
                "index": 1,

            },
            "色彩空间转换": {
                "无": {
                    "state": 0,
                    "index": 3,
                    "mainState": 1,
                    "mainIndex": 4

                },
                "RGB 色彩空间": {
                    "cvProc": "COLOR_BGR2RGB"

                },
                "GRAY 色彩空间": {
                    "cvProc": "COLOR_BGR2GRAY"

                },
                "YCrCb 色彩空间": {
                    "cvProc": "COLOR_BGR2YCrCb"

                },
                "HSV 色彩空间": {
                    "cvProc": "COLOR_RGB2HSV"

                }

            },
            "几何变换": {
                "无": {
                    "state": 0,
                    "index": 2,

                },
                "缩放": {
                    "无": {
                        "state": 0,
                        "index": 3,
                        "mainState": 1,
                        "mainIndex": 4,
                        "mainValueDict": {
                            "width": {
                                "value": imgWidth,
                                "valueFrom": 0,
                                "valueTo": imgWidth * 2,
                                "stepSize": 1

                            },
                            "height": {
                                "value": imgHeight,
                                "valueFrom": 0,
                                "valueTo": imgHeight * 2,
                                "stepSize": 1

                            },
                            "fx": {
                                "value": 1,
                                "valueFrom": 0,
                                "valueTo": 2,
                                "stepSize": 0.01
                            },
                            "fy": {
                                "value": 1,
                                "valueFrom": 0,
                                "valueTo": 2,
                                "stepSize": 0.01

                            }

                        }

                    },
                    "最近邻插值": {
                        "cvProc": "resize_INTER_NEAREST"

                    },
                    "双线性差值": {
                        "cvProc": "resize_INTER_LINEAR"

                    },
                    "3次样条插值": {
                        "cvProc": "resize_INTER_CUBIC"

                    },
                    "区域插值": {
                        "cvProc": "resize_INTER_AREA"

                    },
                    "Lanczos 差值": {
                        "cvProc": "resize_INTER_LANCZOS4"

                    },
                    "位精确双线性插值": {
                        "cvProc": "resize_INTER_LINEAR_EXACT"

                    },
                    "插值编码掩码": {
                        "cvProc": "resize_INTER_MAX"

                    }

                },
                "翻转": {
                    "无": {
                        "state": 0,
                        "index": 3,
                        "mainState": 1,
                        "mainIndex": 4

                    },
                    "垂直翻转": {
                        "cvProc": "flip_0"

                    },
                    "水平翻转": {
                        "cvProc": "flip_1"

                    },
                    "水平、垂直翻转": {
                        "cvProc": "flip_-1"

                    }

                }


            },
            "图像模糊": {
                "无": {
                    "state": 0,
                    "index": 3,
                    "mainState": 1,
                    "mainIndex": 4,
                    "mainValueDict": ksizeBasic

                },
                "均值滤波": {
                    "cvProc": "blur_blur"

                },
                "高斯滤波": {
                    "cvProc": "blur_Gaussian",
                    "valueDict": ksizeOddNum

                },
                "方框滤波": {
                    "cvProc": "blur_boxFilter"

                },
                "中值滤波": {
                    "cvProc": "blur_median", 
                    "valueDict": {
                        "ksize": {
                            "value": 21, 
                            "valueFrom": 1, 
                            "valueTo": 103, 
                            "stepSize": 2
                            
                        }
                        
                    }
                    
                }, 
                "双边滤波": {
                    "cvProc": "blur_bilateralFilter", 
                    "valueDict": {
                        "d": {
                            "value": 7, 
                            "valueFrom": 1, 
                            "valueTo": 100, 
                            "setpSize": 1
                            
                        }, 
                        "sigmaColor": {
                            "value": 75, 
                            "valueFrom": 1, 
                            "valueTo": 200, 
                            "setpSize": 1
                            
                        }, 
                        "sigmaSpace": {
                            "value": 75, 
                            "valueFrom": 1, 
                            "valueTo": 200, 
                            "setpSize": 1
                            
                        }
                        
                    }
                    
                }

            },
            "阈值处理": {
                "无": {
                    "state": 0,
                    "index": 3,
                    "mainState": 1,
                    "mainIndex": 4,
                    "mainValueDict": {
                        "thresh": {
                            "value": 128,
                            "valueFrom": 0,
                            "valueTo": 255,
                            "stepSize": 1

                        },
                        "maxval": {
                            "value": 255,
                            "valueFrom": 0,
                            "valueTo": 255,
                            "stepSize": 1

                        }

                    }

                },
                "二值化阈值处理": {
                    "cvProc": "THRESH_BINARY"

                },
                "反二值化阈值处理": {
                    "cvProc": "THRESH_BINARY_INV"

                },
                "截断阈值处理": {
                    "cvProc": "THRESH_TRUNC"

                },
                "低阈值零处理": {
                    "cvProc": "THRESH_TOZERO"

                },
                "超阈值零处理": {
                    "cvProc": "THRESH_TOZERO_INV"

                },
                "Qtsu 算法阈值处理": {
                    "cvProc": "THRESH_OTSU"

                },
                "三角算法阈值处理": {
                    "cvProc": "THRESH_TRIANGLE"

                },
                "自适应阈值处理": {
                    "cvProc": "THRESH_adaptive",
                    "valueDict": {
                        "maxValue": {
                            "value": 255,
                            "valueFrom": 0,
                            "valueTo": 255,
                            "stepSize": 1

                        },
                        "blockSize": {
                            "value": 5,
                            "valueFrom": 3,
                            "valueTo": 99,
                            "stepSize": 2

                        },
                        "C": {
                            "value": 10,
                            "valueFrom": 0,
                            "valueTo": 50,
                            "stepSize": 1
                        }

                    }

                }


            },
            "形态变换": {
                "无": {
                    "state": 0,
                    "index": 2,
                    "mainState": 1,
                    "mainIndex": 3,
                    "mainValueDict": {
                        "kernel": {
                            "value": 3,
                            "valueFrom": 1,
                            "valueTo": 30,
                            "stepSize": 1

                        },

                    }

                },
                "腐蚀": {
                    "cvProc": "form_erode"

                },
                "膨胀": {
                    "cvProc": "form_dilate"

                }

            }
        },
        "边缘检测": {
            "无": {
                "state": 0,
                "index": 1,
                "mainState": 1,
                "mainIndex": 3

            },
            "Laplacian 边缘检测": {
                "cvProc": "edge_Laplacian"

            },
            "Sobel 边缘检测": {
                "cvProc": "edge_Sobel"

            },
            "Canny": {
                "cvProc": "edge_Canny",
                "valueDict": {
                    "threshold1": {
                        "value": 200,
                        "valueFrom": 0,
                        "valueTo": 1000,
                        "stepSize": 1

                    },
                    "threshold2": {
                        "value": 300,
                        "valueFrom": 0,
                        "valueTo": 1000,
                        "stepSize": 1

                    },
                    "apertureSize": {
                        "value": 3,
                        "valueFrom": 3,
                        "valueTo": 7,
                        "stepSize": 2

                    }

                }

            }

        },
        "轮廓绘制": {
            "无": {
                "state": 0,
                "index": 1,
                "mainState": 0,
                "mainIndex": 3
            },
            "所有轮廓": {
                "无": {
                    "index": 3,
                    "mainState": 1,
                    "mainValueDict": canvasBasic

                },
                "储存所有轮廓点": {
                    "cvProc": "contours_LIST_NONE"

                },
                "只保存水平、垂直和对角线的端点": {
                    "cvProc": "contours_LIST_SIMPLE"

                },
                "Teh-Chin 链逼近算法": {
                    "cvProc": "contours_LIST_Teh-Chin"

                }

            },
            "外部轮廓": {
                "无": {
                    "index": 3,
                    "mainState": 1,
                    "mainValueDict": canvasBasic

                },
                "储存所有轮廓点": {
                    "cvProc": "contours_EXTERNAL_NONE"

                },
                "只保存水平、垂直和对角线的端点": {
                    "cvProc": "contours_EXTERNAL_SIMPLE"

                },
                "Teh-Chin 链逼近算法": {
                    "cvProc": "contours_RXTERVAL_Teh-Chin"

                }

            },
            "绘制": {
                "无": {
                    "index": 3,
                    "mainState": 1,
                    "mainValueDict": {
                        "strokeWidth": {
                            "value": 5,
                            "valueFrom": 1,
                            "valueTo": 20,
                            "stepSize": 1

                        },
                        "图片选择": {
                            "value": currentImgIndex,
                            "valueFrom": 0,
                            "valueTo": currentMaxIndex,
                            "stepSize": 1

                        }

                    }
                },
                "绘制所有线条": {
                    "state": 1,
                    "index": 2,
                    "cvProc": "contours_draw_line",
                    "valueDict": Object.assign({
                        "rho": {
                            "value": 1,
                            "valueFrom": 1,
                            "valueTo": 30,
                            "stepSize": 1

                        },
                        "theta": {
                            "value": Math.PI / 180,
                            "valueFrom": Math.PI / 360,
                            "valueTo": Math.PI / 2,
                            "stepSize": Math.PI / 360

                        },
                        "threshold": {
                            "value": 50,
                            "valueFrom": 0,
                            "valueTo": 200,
                            "stepSize": 1

                        },
                        "srn": {
                            "value": 50,
                            "valueFrom": 0,
                            "valueTo": 200,
                            "stepSize": 1

                        },
                        "stn": {
                            "value": 10,
                            "valueFrom": 0,
                            "valueTo": 500,
                            "stepSize": 1

                        }

                    }, canvasBasic)

                }

            }

        }

    };

}


module.exports = this