function cvProc(procType, data, other) {
    // 索引列表
    let procList = procType.split("_");
    
    // OpenCV Mat对象
    let img = images.read(currentSelectImgPath);
    let imgMat = img.getMat();

    // 索引处理
    switch (procList[0]) {
        // 色彩空间
        case "COLOR":
            switch (procList[1]) {
                // RGB 色彩空间
                case "BGR2RGB":
                    Imgproc.cvtColor(imgMat, imgMat, Imgproc.COLOR_BGR2RGB);
                    break;

                    // GRAY 色彩空间
                case "BGR2GRAY":
                    Imgproc.cvtColor(imgMat, imgMat, Imgproc.COLOR_BGR2GRAY);
                    break;

                    // YCrCb 色彩空间
                case "BGR2YCrCb":
                    Imgproc.cvtColor(imgMat, imgMat, Imgproc.COLOR_BGR2YCrCb);
                    break;

                    // HSV 色彩空间
                case "RGB2HSV":
                    Imgproc.cvtColor(imgMat, imgMat, Imgproc.COLOR_RGB2HSV);
                    break;

            }
            break;

            // 几何变换 (缩放)
        case "resize":
            switch (procList[1]) {
                case "INTER":
                    // 基础变量
                    let size = new Size(data["width"], data["height"]);
                    let fx = data["fx"];
                    let fy = data["fy"];

                    switch (procList[2]) {
                        // 最近邻插值
                        case "NEAREST":
                            Imgproc.resize(imgMat, imgMat, size, fx, fy, Imgproc.INTER_NEAREST);
                            break;

                            // 双线性差值
                        case "LINEAR":
                            Imgproc.resize(imgMat, imgMat, size, fx, fy, Imgproc.INTER_LINEAR);
                            break;

                            // 3次样条插值
                        case "CUBIC":
                            Imgproc.resize(imgMat, imgMat, size, fx, fy, Imgproc.INTER_CUBIC);
                            break;

                            // 区域插值
                        case "AREA":
                            Imgproc.resize(imgMat, imgMat, size, fx, fy, Imgproc.INTER_AREA);
                            break;

                            // Lanczos 差值
                        case "LANCZOS4":
                            Imgproc.resize(imgMat, imgMat, size, fx, fy, Imgproc.INTER_LANCZOS4);
                            break;

                            // 位精确双线性插值
                        case "LINEAR":
                            switch (procList[3]) {
                                case "EXACT":
                                    Imgproc.resize(imgMat, imgMat, size, fx, fy, Imgproc.INTER_LINEAR_EXACT);
                                    break;

                            }

                            break;

                            // 差值编码掩码
                        case "INTER_MAX":
                            // 目前没什么用处
                            Imgproc.resize(imgMat, imgMat, size, fx, fy, Imgproc.INTER_MAX);

                    }
            }
            break;

            // 翻转
        case "flip":
            switch (procList[1]) {
                // 垂直翻转
                case "0":
                    Core.flip(imgMat, imgMat, 0)
                    break;

                    // 水平翻转
                case "1":
                    Core.flip(imgMat, imgMat, 1);
                    break;

                    // 水平、垂直翻转
                case "-1":
                    Core.flip(imgMat, imgMat, -1);
                    break;

            }
            break;

            // 图像模糊
        case "blur":
            {
                let ksizeX = data["ksizeX"];
                let ksizeY = data["ksizeY"];
                let ksize = data["ksize"];
                if (ksize || ksizeX && ksizeY) {
                    ksize = new Size(ksize + ksizeX, ksize + ksizeY);

                } else {
                    ksize = new Size(1, 1);

                }

                switch (procList[1]) {
                    // 均值滤波
                    case "blur":
                        Imgproc.blur(imgMat, imgMat, ksize);
                        break;

                        // 高斯滤波
                    case "Gaussian":
                        Imgproc.GaussianBlur(imgMat, imgMat, ksize, 0, 0);
                        break;

                        // 方框滤波
                    case "boxFilter":
                        Imgproc.boxFilter(imgMat, imgMat, -1, ksize);
                        break;
                    
                    // 中值滤波
                    case "median": 
                        Imgproc.medianBlur(imgMat, imgMat, data["ksize"]);
                        break;
                    
                    // 双边滤波
                    case "bilateralFilter": 
                        Imgproc.bilateralFilter(imgMat, imgMat, data["d"], data["sigmaColor"], data["sigmaSpace"]);
                        break;
                    
                }
                break;

            }


            // 阈值处理
        case "THRESH":
            // 基础变量
            let thresh = data["thresh"];
            let maxval = data["maxval"];

            switch (procList[1]) {
                // 二值化阈值处理
                case "BINARY":
                    if (procList[2]) {
                        Imgproc.cvtColor(imgMat, imgMat, Imgproc.COLOR_BGR2GRAY);
                        Imgproc.threshold(imgMat, imgMat, thresh, maxval, Imgproc.THRESH_BINARY_INV);

                    } else {
                        Imgproc.threshold(imgMat, imgMat, thresh, maxval, Imgproc.THRESH_BINARY);

                    }
                    break;

                    // 截断阈值处理
                case "TRUNC":
                    Imgproc.threshold(imgMat, imgMat, thresh, maxval, Imgproc.THRESH_TRUNC);
                    break;

                    // 阈值零处理
                case "TOZERO":
                    if (procList[2]) {
                        Imgproc.cvtColor(imgMat, imgMat, Imgproc.COLOR_BGR2GRAY);
                        // 超阈值零处理
                        Imgproc.threshold(imgMat, imgMat, thresh, maxval, Imgproc.THRESH_TOZERO_INV);

                    } else {
                        // 低阈值零处理
                        Imgproc.threshold(imgMat, imgMat, thresh, maxval, Imgproc.THRESH_TOZERO);

                    }
                    break;

                    // Qtsu 算法阈值处理
                case "OTSU":
                    Imgproc.cvtColor(imgMat, imgMat, Imgproc.COLOR_BGR2GRAY);
                    Imgproc.threshold(imgMat, imgMat, thresh, maxval, Imgproc.THRESH_OTSU);
                    break;

                    // 三角算法阈值处理
                case "TRIANGLE":
                    Imgproc.cvtColor(imgMat, imgMat, Imgproc.COLOR_BGR2GRAY);
                    Imgproc.threshold(imgMat, imgMat, thresh, maxval, Imgproc.THRESH_TRIANGLE);
                    break;

                    // 自适应阈值处理
                case "adaptive":
                    Imgproc.cvtColor(imgMat, imgMat, Imgproc.COLOR_BGR2GRAY);
                    Imgproc.adaptiveThreshold(imgMat, imgMat, data["maxValue"], Imgproc.ADAPTIVE_THRESH_MEAN_C, Imgproc.THRESH_BINARY, data["blockSize"], data["C"]);
                    break;

            }
            break;

            // 形态变换
        case "form":
            let kernel = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(data["kernel"], data["kernel"]));

            switch (procList[1]) {
                // 腐蚀
                case "erode":
                    Imgproc.erode(imgMat, imgMat, kernel, new Point(-1, -1), 1);
                    break;

                    // 膨胀
                case "dilate":
                    Imgproc.dilate(imgMat, imgMat, kernel, new Point(-1, -1), 1);
                    break;

            }
            break;

            // 边缘检测
        case "edge":
            switch (procList[1]) {
                // Laplacian 边缘检测
                case "Laplacian":
                    Imgproc.Laplacian(imgMat, imgMat, -1, 0, 1);
                    break;

                    // Sobel 边缘检测
                case "Sobel":
                    Imgproc.Sobel(imgMat, imgMat, -1, 0, 1);
                    break;

                    // Canny 边缘检测
                case 'Canny':
                    Imgproc.cvtColor(imgMat, imgMat, Imgproc.COLOR_BGR2GRAY);
                    Imgproc.Canny(imgMat, imgMat, data["threshold1"], data["threshold2"], data["apertureSize"], true)
                    break;

            }
            break;

            // 轮廓绘制
        case "contours":
            // 颜色空间转换: 灰度图
            Imgproc.cvtColor(imgMat, imgMat, Imgproc.COLOR_BGR2GRAY);

            // 画板
            var paint = new Paint();
            paint.setTextAlign(Paint.Align.CENTER); //写字左右中心
            paint.setStrokeWidth(data["strokeWidth"]); //边缘宽度  
            paint.setStyle(Paint.Style.STROKE); //空心样式
            paint.setColor(Color.BLUE);

            var canvas = new Canvas(getImgIndex(data["图片选择"] - 1));

            // 提取轮廓
            var contours = new ArrayList();
            var hierarchy = new Mat();

            // 绘制轮廓
            if (procList[1] == "draw") {
                Imgproc.findContours(imgMat, contours, hierarchy, Imgproc.RETR_LIST, Imgproc.CHAIN_APPROX_NONE);

                switch (procList[2]) {
                    // 绘制所有线条
                    case "line":
                        let lines = new Mat();
                        Imgproc.HoughLinesP(imgMat, lines, data["rho"], data["theta"], data["threshold"], data["srn"], data["stn"]); // HoughLinesP 具体讲解致谢 https://zhuanlan.zhihu.com/p/660779705

                        for (let i = 0; i < lines.rows(); i++) {
                            let line = lines.get(i, 0);
                            let pt1 = new Point(line[0], line[1]);
                            let pt2 = new Point(line[2], line[3]);

                            canvas.drawLine(pt1.x, pt1.y, pt2.x, pt2.y, paint);

                        }
                        break;

                }

            } else {
                switch (procList[1]) {
                    // 所有轮廓
                    case "LIST":
                        switch (procList[2]) {
                            // 所有
                            case "NONE":
                                Imgproc.findContours(imgMat, contours, hierarchy, Imgproc.RETR_LIST, Imgproc.CHAIN_APPROX_NONE);
                                break;

                                // 简单的
                            case "SINPLE":
                                Imgproc.findContours(imgMat, contours, hierarchy, Imgproc.RETR_LIST, Imgproc.CHAIN_APPROX_SIMPLE);
                                break;

                                // Teh-Chin 链逼近算法
                            case "Teh-Chin":
                                Imgproc.findContours(imgMat, contours, hierarchy, Imgproc.RETR_LIST, Imgproc.CHAIN_APPROX_TC89_L1);
                                break;

                        }
                        break;

                        // 外部轮廓
                    case "EXTERNAL":
                        switch (procList[2]) {
                            // 所有
                            case "NONE":
                                Imgproc.findContours(imgMat, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_NONE);
                                break;

                                // 简单的
                            case "SINPLE":
                                Imgproc.findContours(imgMat, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);
                                break;

                                // Teh-Chin 链逼近算法
                            case "Teh-Chin":
                                Imgproc.findContours(imgMat, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_TC89_L1);
                                break;

                        }
                        break;

                }

                let bigArr = [];
                let cxyArr = [];
                let areaArr = [];
                for (var i = 0; i < contours.size(); i++) {
                    var ii = contours.get(i);
                    var len = ii.size();
                    // 提取轮廓坐标
                    for (var w = 0; w < len.width; w++) {
                        for (var h = 0; h < len.height; h++) {
                            var iv = ii.get(h, w);
                            canvas.drawPoint(iv[0], iv[1], paint);

                        }
                    }

                }

            }

            imgMat = canvas.toImage().getMat();

            break;

        default:
            toast("暂未制作，正在开发中......");
            return false;


    }

    // 设置 bitmap 图片
    let bitmapImg = images.matToImage(imgMat).bitmap;
    setBitmapImg(bitmapImg, other);

    img.recycle();

    return true;

}

var scecifiedNumCvProcThread;

function scecifiedNumCvProc(procType, procData, number, delay, other) {
    // 赋值其他
    if (!other) {
        other = {};

    }

    // 使用新线程执行
    scecifiedNumCvProcThread = threads.start(function() {
        for (let i = 1; i <= number; i++) {
            sleep(delay);

            try {
                cvProc(procType, null, other);

            } catch (e) {
                /* null */

            }

            if (other["toast"] == true) {
                toast(`处理成功 (${i}): ${procType}`);

            }

        }

        return true;
    });

}

// 中断运行
scecifiedNumCvProc.interrupt = function() {
    if (!scecifiedNumCvProcThread) {
        return true;

    }

    if (scecifiedNumCvProcThread.isAlive()) {
        scecifiedNumCvProcThread.interrupt();

        return false;
    } else {
        return true;

    }

}


module.exports = this;