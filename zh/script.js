// DOM元素
const textInput = document.getElementById('text-input');
const textPreview = document.getElementById('text-preview');
const fontSizeSlider = document.getElementById('font-size');
const fontSizeValue = document.getElementById('font-size-value');
const textColorPicker = document.getElementById('text-color');
const bgColorPicker = document.getElementById('bg-color');
const blurEffectSlider = document.getElementById('blur-effect');
const blurEffectValue = document.getElementById('blur-effect-value');
const borderRadiusSlider = document.getElementById('border-radius');
const borderRadiusValue = document.getElementById('border-radius-value');
const canvasWidthInput = document.getElementById('canvas-width');
const canvasHeightInput = document.getElementById('canvas-height');
const previewPanel = document.getElementById('preview-panel');
const textShadowSlider = document.getElementById('text-shadow');
const textShadowValue = document.getElementById('text-shadow-value');
const resetButton = document.getElementById('reset-button');
const downloadPngButton = document.getElementById('download-png');
const downloadJpgButton = document.getElementById('download-jpg');
const downloadSvgButton = document.getElementById('download-svg');
const alignLeftBtn = document.getElementById('align-left');
const alignCenterBtn = document.getElementById('align-center');
const alignRightBtn = document.getElementById('align-right');
const textMirrorBtn = document.getElementById('text-mirror');
const textFlipBtn = document.getElementById('text-flip');
const textRotateBtn = document.getElementById('text-rotate');
const textUppercaseBtn = document.getElementById('text-uppercase');
const presets = document.querySelectorAll('.preset');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomResetBtn = document.getElementById('zoom-reset');
const zoomLevelDisplay = document.getElementById('zoom-level');
const previewWrapper = document.querySelector('.preview-wrapper');
const headerElement = document.querySelector('header');

// 默认设置
const defaultSettings = {
    text: 'input some text to generate your custom brat cover',
    fontSize: 40,
    textColor: '#000000',
    bgColor: '#8AE403',
    blurEffect: 1.5,
    borderRadius: 0,
    canvasWidth: 594,
    canvasHeight: 594,
    textAlign: 'center',
    textShadow: 0,
    zoomLevel: 100,
    textTransform: {
        mirror: false,
        flip: false,
        rotate: 0,
        uppercase: false
    }
};

// 当前设置
let currentSettings = {...defaultSettings};
let zoomLevel = 100;

// 设备检测函数拓展，添加iPhone检测
function detectDevice() {
    // 检测是否为iPad
    const isIpad = /iPad|iPad.*|Macintosh.*iPad/i.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && 
                  navigator.maxTouchPoints > 1 && 
                  !navigator.userAgent.includes('iPhone'));
    
    // 检测是否为iPhone
    const isIphone = /iPhone|iPod/i.test(navigator.userAgent) || 
                    (navigator.platform === 'iPhone');
    
    // 检测是否为iPhone 14 Pro Max或类似大屏iPhone
    const isLargeIphone = isIphone && 
                        (window.screen.width >= 390 && window.screen.height >= 844) ||
                        (window.screen.width >= 844 && window.screen.height >= 390);
    
    // 检测是否为平板设备（包括iPad和其他平板）
    const isTablet = isIpad || 
                    /tablet|Android(?!.*mobile)|Silk/i.test(navigator.userAgent) ||
                    (window.innerWidth >= 768 && window.innerWidth <= 1024);
    
    // 检测设备是否处于横屏模式
    const isLandscape = window.innerWidth > window.innerHeight;
    
    // 应用设备特定的优化
    if (isLargeIphone) {
        console.log('检测到iPhone 14 Pro Max或大屏iPhone设备，应用特定优化');
        optimizeForLargeIphone(isLandscape);
    } else if (isIphone) {
        console.log('检测到iPhone设备，应用优化');
        optimizeForIphone(isLandscape);
    } else if (isIpad || isTablet) {
        // 检测是否为高分辨率iPad（iPad Pro, iPad Air等）
        const isHighResIpad = window.innerWidth >= 1024 && window.devicePixelRatio >= 2;
        
        // 根据iPad型号和方向应用不同的优化
        if (isHighResIpad) {
            console.log('检测到高分辨率iPad设备，应用特定优化');
            optimizeForHighResIpad(isLandscape);
        } else {
            console.log('检测到iPad/平板设备，应用优化');
            optimizeForIpad(isLandscape);
        }
    }
    
    // 监听屏幕方向变化
    window.addEventListener('orientationchange', function() {
        // 延迟执行以确保方向变化完成
        setTimeout(function() {
            const newIsLandscape = window.innerWidth > window.innerHeight;
            if (isLargeIphone) {
                optimizeForLargeIphone(newIsLandscape);
            } else if (isIphone) {
                optimizeForIphone(newIsLandscape);
            } else if (isIpad || isTablet) {
                const isHighResIpad = window.innerWidth >= 1024 && window.devicePixelRatio >= 2;
                if (isHighResIpad) {
                    optimizeForHighResIpad(newIsLandscape);
                } else {
                    optimizeForIpad(newIsLandscape);
                }
            }
        }, 300);
    });
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        const newIsLandscape = window.innerWidth > window.innerHeight;
        if (isLargeIphone) {
            optimizeForLargeIphone(newIsLandscape);
        } else if (isIphone) {
            optimizeForIphone(newIsLandscape);
        } else if (isIpad || isTablet) {
            const isHighResIpad = window.innerWidth >= 1024 && window.devicePixelRatio >= 2;
            
            if (isHighResIpad) {
                optimizeForHighResIpad(newIsLandscape);
            } else {
                optimizeForIpad(newIsLandscape);
            }
        }
    });
}

// 为iPad设备优化
function optimizeForIpad(isLandscape) {
    // 获取主要元素
    const mainContainer = document.querySelector('main');
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    const previewWrapper = document.querySelector('.preview-wrapper');
    const preview = document.querySelector('.preview');
    
    // 根据横屏/竖屏模式应用不同的优化
    if (isLandscape) {
        console.log('iPad横屏模式优化');
        
        // 横屏模式保持左右布局但调整宽度比例
        mainContainer.style.flexDirection = 'row';
        mainContainer.style.flexWrap = 'nowrap';
        mainContainer.style.gap = '1rem';
        
        leftPanel.style.flex = '1 0 45%';
        leftPanel.style.maxWidth = '45%';
        leftPanel.style.maxHeight = '80vh';
        leftPanel.style.overflowY = 'auto';
        
        rightPanel.style.flex = '1 0 45%';
        rightPanel.style.maxWidth = '45%';
        
        // 调整预览区域
        previewWrapper.style.width = '100%';
        previewWrapper.style.maxWidth = '500px';
        
        // 确保预览区大小合适
        adjustCanvasForIpad();
    } else {
        console.log('iPad竖屏模式优化');
        
        // 竖屏模式可以考虑上下布局
        mainContainer.style.flexDirection = 'column';
        mainContainer.style.flexWrap = 'wrap';
        mainContainer.style.gap = '1rem';
        
        leftPanel.style.flex = '1 0 100%';
        leftPanel.style.maxWidth = '100%';
        leftPanel.style.maxHeight = 'none';
        leftPanel.style.overflowY = 'visible';
        
        rightPanel.style.flex = '1 0 100%';
        rightPanel.style.maxWidth = '100%';
        
        // 调整预览区域
        previewWrapper.style.width = '100%';
        previewWrapper.style.maxWidth = '400px';
        
        // 确保预览区大小合适
        adjustCanvasForIpad();
    }
}

// 为高分辨率iPad优化
function optimizeForHighResIpad(isLandscape) {
    // 与普通iPad的优化基本相同，但有一些参数调整
    optimizeForIpad(isLandscape);
    
    // 获取元素
    const previewWrapper = document.querySelector('.preview-wrapper');
    
    // 高分辨率iPad的预览区域可以更大
    previewWrapper.style.maxWidth = isLandscape ? '550px' : '450px';
    
    // 调整控件尺寸
    document.querySelectorAll('.control-section').forEach(section => {
        section.style.padding = '1rem';
    });
    
    // 确保预览区大小合适
    adjustCanvasForIpad(true);
}

// 调整Canvas大小适应iPad
function adjustCanvasForIpad(isHighRes = false) {
    // 获取当前屏幕方向
    const isLandscape = window.innerWidth > window.innerHeight;
    
    // 调整预览画布大小
    let optimalWidth, optimalHeight;
    
    if (isHighRes) {
        // 高分辨率iPad的尺寸调整
        optimalWidth = isLandscape ? 550 : 450;
    } else {
        // 普通iPad的尺寸调整
        optimalWidth = isLandscape ? 500 : 400;
    }
    
    // 保持正方形比例
    optimalHeight = optimalWidth;
    
    // 仅当当前设置不合适时才更新
    if (Math.abs(currentSettings.canvasWidth - optimalWidth) > 50) {
        // 更新设置
        currentSettings.canvasWidth = optimalWidth;
        currentSettings.canvasHeight = optimalHeight;
        
        // 更新输入框值
        canvasWidthInput.value = optimalWidth;
        canvasHeightInput.value = optimalHeight;
        
        // 更新预览
        updatePreview();
    }
}

// 为iPhone设备优化
function optimizeForIphone(isLandscape) {
    // 获取主要元素
    const mainContainer = document.querySelector('main');
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    const previewWrapper = document.querySelector('.preview-wrapper');
    const preview = document.querySelector('.preview');
    const textPreview = document.getElementById('text-preview');
    
    // 根据横屏/竖屏模式应用不同的优化
    if (isLandscape) {
        console.log('iPhone横屏模式优化');
        
        // 横屏模式调整
        mainContainer.style.flexDirection = 'row';
        mainContainer.style.flexWrap = 'nowrap';
        mainContainer.style.gap = '0.5rem';
        
        leftPanel.style.flex = '1 0 45%';
        leftPanel.style.maxWidth = '45%';
        leftPanel.style.margin = '0 0.5rem 0 0';
        
        rightPanel.style.flex = '1 0 55%';
        rightPanel.style.maxWidth = '55%';
        
        // 调整预览区域
        previewWrapper.style.width = '100%';
        previewWrapper.style.maxWidth = '320px';
        previewWrapper.style.transformOrigin = 'center center';
        
        // 确保文本不变形
        if (currentSettings.text.length > 30) {
            textPreview.style.fontSize = '18px';
        } else {
            textPreview.style.fontSize = '22px';
        }
    } else {
        console.log('iPhone竖屏模式优化');
        
        // 竖屏模式上下布局
        mainContainer.style.flexDirection = 'column';
        mainContainer.style.flexWrap = 'wrap';
        mainContainer.style.gap = '0.8rem';
        
        leftPanel.style.flex = '1 0 100%';
        leftPanel.style.maxWidth = '100%';
        leftPanel.style.margin = '0 0 0.5rem 0';
        
        rightPanel.style.flex = '1 0 100%';
        rightPanel.style.maxWidth = '100%';
        
        // 调整预览区域
        previewWrapper.style.width = '100%';
        previewWrapper.style.maxWidth = '350px';
        previewWrapper.style.transformOrigin = 'top center';
        
        // 确保文本在竖屏模式下正确显示
        adjustTextSizeForMobile();
    }
    
    // 使用CSS原生的aspect-ratio确保预览区保持正方形
    preview.style.aspectRatio = '1/1';
    
    // 调整画布大小以适应不同的iPhone
    adjustCanvasForIphone();
}

// 为iPhone 14 Pro Max等大屏iPhone优化
function optimizeForLargeIphone(isLandscape) {
    // 先应用通用iPhone优化
    optimizeForIphone(isLandscape);
    
    // 获取预览元素
    const previewWrapper = document.querySelector('.preview-wrapper');
    const textPreview = document.getElementById('text-preview');
    
    // 为大屏iPhone做特殊调整
    if (isLandscape) {
        previewWrapper.style.maxWidth = '380px';
        
        // 更适合大屏iPhone的文本大小
        if (currentSettings.text.length > 30) {
            textPreview.style.fontSize = '20px';
        } else {
            textPreview.style.fontSize = '26px';
        }
    } else {
        previewWrapper.style.maxWidth = '400px';
        
        // 竖屏模式下的优化
        if (currentSettings.text.length > 30) {
            textPreview.style.fontSize = '22px';
        } else {
            textPreview.style.fontSize = '32px';
        }
    }
    
    // 调整画布大小为较大值
    adjustCanvasForIphone(true);
}

// 调整Canvas大小适应iPhone
function adjustCanvasForIphone(isLargeIphone = false) {
    // 获取当前屏幕方向
    const isLandscape = window.innerWidth > window.innerHeight;
    
    // 调整预览画布大小
    let optimalWidth, optimalHeight;
    
    if (isLargeIphone) {
        // iPhone 14 Pro Max等大屏iPhone的尺寸调整
        optimalWidth = isLandscape ? 380 : 400;
    } else {
        // 普通iPhone的尺寸调整
        optimalWidth = isLandscape ? 320 : 350;
    }
    
    // 保持正方形比例
    optimalHeight = optimalWidth;
    
    // 更新设置
    currentSettings.canvasWidth = optimalWidth;
    currentSettings.canvasHeight = optimalHeight;
    
    // 更新输入框值
    canvasWidthInput.value = optimalWidth;
    canvasHeightInput.value = optimalHeight;
    
    // 更新预览
    updatePreview();
}

// 移动设备文本大小调整
function adjustTextSizeForMobile() {
    const textPreview = document.getElementById('text-preview');
    const textLength = currentSettings.text.length;
    
    // 根据文本长度优化显示
    if (textLength > 100) {
        textPreview.style.fontSize = '12px';
        textPreview.style.padding = '10px';
    } else if (textLength > 50) {
        textPreview.style.fontSize = '16px';
        textPreview.style.padding = '15px';
    } else if (textLength > 20) {
        textPreview.style.fontSize = '20px';
        textPreview.style.padding = '15px';
    } else {
        textPreview.style.fontSize = '24px';
        textPreview.style.padding = '20px';
    }
}

// 初始化函数
function init() {
    // 设置初始值
    textPreview.textContent = defaultSettings.text;
    
    // 检测初始文本长度并应用适当的样式
    adjustTextSize();
    
    // 确保初始化时应用正确的圆角值
    previewPanel.style.borderRadius = `${defaultSettings.borderRadius}px`;
    
    // 确保header元素是可见的
    if (headerElement) {
        headerElement.style.display = 'block';
        headerElement.style.visibility = 'visible';
        console.log('Header visibility set to visible');
    }
    
    // 根据默认设置初始化按钮状态
    if (defaultSettings.textAlign === 'left') {
        alignLeftBtn.classList.add('active');
        alignCenterBtn.classList.remove('active');
        alignRightBtn.classList.remove('active');
    } else if (defaultSettings.textAlign === 'right') {
        alignLeftBtn.classList.remove('active');
        alignCenterBtn.classList.remove('active');
        alignRightBtn.classList.add('active');
    } else {
        alignLeftBtn.classList.remove('active');
        alignCenterBtn.classList.add('active');
        alignRightBtn.classList.remove('active');
    }
    
    updatePreview();
    
    // 事件监听器
    textInput.addEventListener('input', handleTextChange);
    fontSizeSlider.addEventListener('input', handleFontSizeChange);
    textColorPicker.addEventListener('input', handleTextColorChange);
    bgColorPicker.addEventListener('input', handleBgColorChange);
    blurEffectSlider.addEventListener('input', handleBlurEffectChange);
    borderRadiusSlider.addEventListener('input', handleBorderRadiusChange);
    canvasWidthInput.addEventListener('change', handleCanvasSizeChange);
    canvasHeightInput.addEventListener('change', handleCanvasSizeChange);
    textShadowSlider.addEventListener('input', handleTextShadowChange);
    resetButton.addEventListener('click', resetSettings);
    
    // 下载按钮
    downloadPngButton.addEventListener('click', () => downloadImage('png'));
    downloadJpgButton.addEventListener('click', () => downloadImage('jpg'));
    downloadSvgButton.addEventListener('click', () => downloadImage('svg'));
    
    // 文本对齐按钮 - 使用直接函数而不是箭头函数以解决可能的作用域问题
    alignLeftBtn.addEventListener('click', function() {
        setTextAlign('left');
    });
    
    alignCenterBtn.addEventListener('click', function() {
        setTextAlign('center');
    });
    
    alignRightBtn.addEventListener('click', function() {
        setTextAlign('right');
    });
    
    // 文本变换按钮
    textMirrorBtn.addEventListener('click', toggleTextMirror);
    textFlipBtn.addEventListener('click', toggleTextFlip);
    textRotateBtn.addEventListener('click', toggleTextRotate);
    textUppercaseBtn.addEventListener('click', toggleTextUppercase);
    
    // 预设样式按钮
    presets.forEach(preset => {
        preset.addEventListener('click', handlePresetClick);
    });
    
    // 缩放控制
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    zoomResetBtn.addEventListener('click', resetZoom);
    
    // 添加设备检测
    detectDevice();
    
    // 记录初始状态已应用
    console.log('初始化完成，文本对齐模式: ' + currentSettings.textAlign);
}

// 更新预览
function updatePreview() {
    // 确保首先应用文本对齐
    textPreview.style.textAlign = currentSettings.textAlign;
    console.log('更新预览，文本对齐: ' + currentSettings.textAlign);
    
    // 更新文本预览其他属性
    textPreview.style.fontSize = `${currentSettings.fontSize}px`;
    textPreview.style.color = currentSettings.textColor;
    textPreview.style.filter = `blur(${currentSettings.blurEffect}px)`;
    textPreview.style.textShadow = `0 0 ${currentSettings.textShadow}px ${currentSettings.textColor}`;
    
    // 应用文本变换
    let transforms = [];
    if (currentSettings.textTransform.mirror) {
        transforms.push('scaleX(-1)');
    }
    if (currentSettings.textTransform.flip) {
        transforms.push('scaleY(-1)');
    }
    if (currentSettings.textTransform.rotate !== 0) {
        transforms.push(`rotate(${currentSettings.textTransform.rotate}deg)`);
    }
    textPreview.style.transform = transforms.length ? transforms.join(' ') : 'none';
    
    // 应用大写转换
    if (currentSettings.textTransform.uppercase) {
        textPreview.style.textTransform = 'uppercase';
    } else {
        textPreview.style.textTransform = 'lowercase';
    }
    
    // 更新预览面板
    previewPanel.style.backgroundColor = currentSettings.bgColor;
    previewPanel.style.borderRadius = `${currentSettings.borderRadius}px`;
    previewPanel.style.width = `${currentSettings.canvasWidth}px`;
    previewPanel.style.height = `${currentSettings.canvasHeight}px`;
    
    // 缩放应用到父容器而不是元素本身，防止溢出
    previewPanel.style.transform = 'none'; // 移除之前的直接缩放
    const scale = zoomLevel / 100;
    previewWrapper.style.transform = `scale(${scale})`;
    previewWrapper.style.transformOrigin = 'center center';
    
    // 更新显示值
    fontSizeValue.textContent = `${currentSettings.fontSize}px`;
    blurEffectValue.textContent = `${currentSettings.blurEffect}px`;
    borderRadiusValue.textContent = `${currentSettings.borderRadius}px`;
    textShadowValue.textContent = `${currentSettings.textShadow}px`;
    zoomLevelDisplay.textContent = `${zoomLevel}%`;
    
    // 强制在移动设备上应用正确的文本对齐样式
    forceTextAlignmentUpdate();
}

// 新增：强制文本对齐更新函数，解决移动设备上文本对齐问题
function forceTextAlignmentUpdate() {
    // 检测是否为移动设备
    const isMobile = window.innerWidth <= 767 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // 获取文本预览元素
        const textPreview = document.getElementById('text-preview');
        
        // 根据当前对齐设置强制应用对齐样式
        if (currentSettings.textAlign === 'left') {
            // 左对齐设置
            textPreview.style.textAlign = 'left';
            textPreview.style.justifyContent = 'flex-start';
            
            // 清除其他可能的样式
            textPreview.classList.remove('align-center', 'align-right');
            textPreview.classList.add('align-left');
        } 
        else if (currentSettings.textAlign === 'right') {
            // 右对齐设置
            textPreview.style.textAlign = 'right';
            textPreview.style.justifyContent = 'flex-end';
            
            // 清除其他可能的样式
            textPreview.classList.remove('align-left', 'align-center');
            textPreview.classList.add('align-right');
        } 
        else {
            // 居中对齐设置（默认）
            textPreview.style.textAlign = 'center';
            textPreview.style.justifyContent = 'center';
            
            // 清除其他可能的样式
            textPreview.classList.remove('align-left', 'align-right');
            textPreview.classList.add('align-center');
        }
        
        // 确保预览区域使用flex布局以便于居中
        const previewPanel = document.getElementById('preview-panel');
        previewPanel.style.display = 'flex';
        previewPanel.style.alignItems = 'center';
        previewPanel.style.justifyContent = 'center';
        
        // 应用额外的属性以确保文本在移动设备上显示正确
        textPreview.style.width = '100%';
        textPreview.style.height = '100%';
        textPreview.style.display = 'flex';
        textPreview.style.alignItems = 'center';
        
        // 给系统一点时间确保样式正确应用
        setTimeout(() => {
            // 二次确认对齐方式
            textPreview.style.textAlign = currentSettings.textAlign;
        }, 50);
    }
}

// 处理文本变化
function handleTextChange() {
    currentSettings.text = textInput.value;
    textPreview.textContent = currentSettings.text;
    
    // 检测文本长度并应用适当的样式
    adjustTextSize();
}

// 新增函数：调整文本大小
function adjustTextSize() {
    const textLength = currentSettings.text.length;
    const words = currentSettings.text.split(' ').length;
    
    // 移除所有文本大小相关类
    textPreview.classList.remove('long-text', 'very-long-text');
    
    // 根据文本长度应用不同样式
    if (textLength > 50 || words > 10) {
        textPreview.classList.add('very-long-text');
    } else if (textLength > 20 || words > 5) {
        textPreview.classList.add('long-text');
    }
    
    // 确保当前字体大小适合容器
    if (textLength > 100) {
        currentSettings.fontSize = Math.min(currentSettings.fontSize, 40);
        fontSizeSlider.value = currentSettings.fontSize;
        fontSizeValue.textContent = `${currentSettings.fontSize}px`;
    }
}

// 处理字体大小变化
function handleFontSizeChange() {
    currentSettings.fontSize = parseInt(fontSizeSlider.value);
    updatePreview();
}

// 处理文本颜色变化
function handleTextColorChange() {
    currentSettings.textColor = textColorPicker.value;
    updatePreview();
}

// 处理背景颜色变化
function handleBgColorChange() {
    currentSettings.bgColor = bgColorPicker.value;
    updatePreview();
    
    // 重置预设按钮的激活状态
    presets.forEach(preset => preset.classList.remove('active'));
}

// 处理模糊效果变化
function handleBlurEffectChange() {
    currentSettings.blurEffect = parseFloat(blurEffectSlider.value);
    updatePreview();
}

// 处理边框圆角变化
function handleBorderRadiusChange() {
    currentSettings.borderRadius = parseInt(borderRadiusSlider.value);
    // 直接应用到预览面板，确保即时更新
    previewPanel.style.borderRadius = `${currentSettings.borderRadius}px`;
    borderRadiusValue.textContent = `${currentSettings.borderRadius}px`;
    updatePreview();
}

// 处理画布尺寸变化
function handleCanvasSizeChange() {
    currentSettings.canvasWidth = parseInt(canvasWidthInput.value);
    currentSettings.canvasHeight = parseInt(canvasHeightInput.value);
    updatePreview();
}

// 处理文本阴影变化
function handleTextShadowChange() {
    currentSettings.textShadow = parseInt(textShadowSlider.value);
    updatePreview();
}

// 设置文本对齐
function setTextAlign(align) {
    console.log('设置文本对齐: ' + align);
    
    // 更新设置
    currentSettings.textAlign = align;
    
    // 更新按钮状态
    alignLeftBtn.classList.remove('active');
    alignCenterBtn.classList.remove('active');
    alignRightBtn.classList.remove('active');
    
    if (align === 'left') alignLeftBtn.classList.add('active');
    if (align === 'center') alignCenterBtn.classList.add('active');
    if (align === 'right') alignRightBtn.classList.add('active');
    
    // 立即更新预览
    textPreview.style.textAlign = align;
    
    // 调用完整的预览更新
    updatePreview();
    
    // 强制重新应用文本对齐，确保正确显示
    forceTextAlignmentUpdate();
}

// 处理预设点击
function handlePresetClick(event) {
    const preset = event.currentTarget;
    
    // 更新按钮状态
    presets.forEach(p => p.classList.remove('active'));
    preset.classList.add('active');
    
    // 设置颜色
    if (preset.classList.contains('preset-green')) {
        currentSettings.bgColor = '#8AE403';
        bgColorPicker.value = '#8AE403';
    } else if (preset.classList.contains('preset-white')) {
        currentSettings.bgColor = '#FFFFFF';
        bgColorPicker.value = '#FFFFFF';
    } else if (preset.classList.contains('preset-pink')) {
        currentSettings.bgColor = '#FF97EA';
        bgColorPicker.value = '#FF97EA';
    } else if (preset.classList.contains('preset-blue')) {
        currentSettings.bgColor = '#97EAFF';
        bgColorPicker.value = '#97EAFF';
    }
    
    updatePreview();
}

// 文本变换功能
function toggleTextMirror() {
    currentSettings.textTransform.mirror = !currentSettings.textTransform.mirror;
    updateButtonState(textMirrorBtn, currentSettings.textTransform.mirror);
    updatePreview();
}

function toggleTextFlip() {
    currentSettings.textTransform.flip = !currentSettings.textTransform.flip;
    updateButtonState(textFlipBtn, currentSettings.textTransform.flip);
    updatePreview();
}

function toggleTextRotate() {
    // 旋转角度循环: 0 -> 90 -> 180 -> 270 -> 0
    const rotationValues = [0, 90, 180, 270];
    const currentIndex = rotationValues.indexOf(currentSettings.textTransform.rotate);
    const nextIndex = (currentIndex + 1) % rotationValues.length;
    currentSettings.textTransform.rotate = rotationValues[nextIndex];
    
    // 更新按钮状态
    updateButtonState(textRotateBtn, currentSettings.textTransform.rotate !== 0);
    
    // 更新旋转角度提示
    if (currentSettings.textTransform.rotate !== 0) {
        textRotateBtn.setAttribute('title', `旋转 ${currentSettings.textTransform.rotate}°`);
    } else {
        textRotateBtn.setAttribute('title', '旋转文本');
    }
    
    updatePreview();
}

function toggleTextUppercase() {
    currentSettings.textTransform.uppercase = !currentSettings.textTransform.uppercase;
    updateButtonState(textUppercaseBtn, currentSettings.textTransform.uppercase);
    updatePreview();
}

// 更新按钮状态
function updateButtonState(button, isActive) {
    if (isActive) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }
}

// 重置设置
function resetSettings() {
    currentSettings = JSON.parse(JSON.stringify(defaultSettings)); // 深拷贝以避免引用问题
    zoomLevel = 100;
    
    // 重置输入值
    textInput.value = defaultSettings.text;
    fontSizeSlider.value = defaultSettings.fontSize;
    textColorPicker.value = defaultSettings.textColor;
    bgColorPicker.value = defaultSettings.bgColor;
    blurEffectSlider.value = defaultSettings.blurEffect;
    borderRadiusSlider.value = defaultSettings.borderRadius;
    canvasWidthInput.value = defaultSettings.canvasWidth;
    canvasHeightInput.value = defaultSettings.canvasHeight;
    textShadowSlider.value = defaultSettings.textShadow;
    
    // 重置按钮状态
    alignLeftBtn.classList.remove('active');
    alignCenterBtn.classList.remove('active');
    alignRightBtn.classList.remove('active');
    
    if (defaultSettings.textAlign === 'left') alignLeftBtn.classList.add('active');
    if (defaultSettings.textAlign === 'center') alignCenterBtn.classList.add('active');
    if (defaultSettings.textAlign === 'right') alignRightBtn.classList.add('active');
    
    // 重置预设按钮
    presets.forEach(preset => preset.classList.remove('active'));
    document.querySelector('.preset-green').classList.add('active');
    
    // 重置文本变换按钮
    updateButtonState(textMirrorBtn, false);
    updateButtonState(textFlipBtn, false);
    updateButtonState(textRotateBtn, false);
    updateButtonState(textUppercaseBtn, false);
    textRotateBtn.setAttribute('title', '旋转文本');
    
    // 更新预览
    textPreview.textContent = defaultSettings.text;
    updatePreview();
}

// 缩放功能
function zoomIn() {
    if (zoomLevel < 200) {
        zoomLevel += 10;
        updatePreview();
    }
}

function zoomOut() {
    if (zoomLevel > 50) {
        zoomLevel -= 10;
        updatePreview();
    }
}

function resetZoom() {
    zoomLevel = 100;
    updatePreview();
}

// 下载图像
function downloadImage(format = 'png') {
    // 创建一个临时的画布
    const canvas = document.createElement('canvas');
    const width = currentSettings.canvasWidth;
    const height = currentSettings.canvasHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // 绘制背景
    ctx.fillStyle = currentSettings.bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // 设置字体样式
    ctx.font = `bold ${currentSettings.fontSize}px ${getComputedStyle(textPreview).fontFamily}`;
    ctx.textAlign = currentSettings.textAlign === 'left' ? 'left' : 
                   currentSettings.textAlign === 'right' ? 'right' : 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = currentSettings.textColor;
    
    // 计算文本位置
    let textX = width / 2;
    if (currentSettings.textAlign === 'left') textX = 40;
    if (currentSettings.textAlign === 'right') textX = width - 40;
    
    // 添加模糊效果（通过多次绘制实现近似效果）
    const blurStrength = Math.min(10, currentSettings.blurEffect); // 限制最大值以避免性能问题
    const shadowBlur = currentSettings.textShadow;
    
    // 添加文本阴影
    ctx.shadowColor = currentSettings.textColor;
    ctx.shadowBlur = shadowBlur;
    
    // 绘制文本
    const lines = currentSettings.text.split('\n');
    const lineHeight = currentSettings.fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = (height - totalHeight) / 2 + lineHeight / 2;
    
    lines.forEach((line, index) => {
        // 保存当前状态
        ctx.save();
        
        // 应用变换 (镜像、翻转、旋转)
        if (currentSettings.textTransform.mirror || 
            currentSettings.textTransform.flip || 
            currentSettings.textTransform.rotate !== 0) {
            
            // 将原点移到画布中心
            ctx.translate(width / 2, startY + index * lineHeight);
            
            // 应用变换
            if (currentSettings.textTransform.mirror) {
                ctx.scale(-1, 1);
            }
            if (currentSettings.textTransform.flip) {
                ctx.scale(1, -1);
            }
            if (currentSettings.textTransform.rotate !== 0) {
                ctx.rotate(currentSettings.textTransform.rotate * Math.PI / 180);
            }
            
            // 调整文本位置
            if (currentSettings.textAlign === 'left') {
                ctx.textAlign = currentSettings.textTransform.mirror ? 'right' : 'left';
            } else if (currentSettings.textAlign === 'right') {
                ctx.textAlign = currentSettings.textTransform.mirror ? 'left' : 'right';
            }
            
            textX = currentSettings.textAlign === 'center' ? 0 : 
                    currentSettings.textAlign === 'left' ? -width / 2 + 40 : 
                    width / 2 - 40;
        } else {
            // 如果没有变换，移动到文本的起始位置
            ctx.translate(0, 0);
        }
        
        // 处理大写转换
        let processedLine = line;
        if (currentSettings.textTransform.uppercase) {
            processedLine = line.toUpperCase();
        }
        
        // 添加模糊效果
        if (blurStrength > 0) {
            // 设置低不透明度以模拟模糊
            ctx.globalAlpha = 0.3 / blurStrength;
            for (let i = 0; i < blurStrength * 3; i++) {
                const offsetX = Math.random() * blurStrength - blurStrength / 2;
                const offsetY = Math.random() * blurStrength - blurStrength / 2;
                
                if (currentSettings.textTransform.mirror || 
                    currentSettings.textTransform.flip || 
                    currentSettings.textTransform.rotate !== 0) {
                    ctx.fillText(processedLine, textX + offsetX, 0 + offsetY);
                } else {
                    ctx.fillText(processedLine, textX + offsetX, startY + index * lineHeight + offsetY);
                }
            }
            // 还原不透明度
            ctx.globalAlpha = 1;
        }
        
        // 绘制主文本
        if (currentSettings.textTransform.mirror || 
            currentSettings.textTransform.flip || 
            currentSettings.textTransform.rotate !== 0) {
            ctx.fillText(processedLine, textX, 0);
        } else {
            ctx.fillText(processedLine, textX, startY + index * lineHeight);
        }
        
        // 恢复状态
        ctx.restore();
    });
    
    // 根据格式处理下载
    let dataURL, fileName, mimeType;
    
    if (format === 'svg') {
        // 创建SVG
        const svgData = createSVG();
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        dataURL = URL.createObjectURL(svgBlob);
        fileName = 'brat-text.svg';
    } else {
        // PNG或JPG格式
        mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        dataURL = canvas.toDataURL(mimeType, 0.92);
        fileName = `brat-text.${format}`;
    }
    
    // 创建下载链接
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // 如果使用了createObjectURL，释放它
    if (format === 'svg') {
        URL.revokeObjectURL(dataURL);
    }
}

// 创建SVG
function createSVG() {
    const width = currentSettings.canvasWidth;
    const height = currentSettings.canvasHeight;
    const text = currentSettings.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const fontSize = currentSettings.fontSize;
    const fontFamily = getComputedStyle(textPreview).fontFamily.replace(/"/g, '\'');
    const textColor = currentSettings.textColor;
    const bgColor = currentSettings.bgColor;
    const blur = currentSettings.blurEffect;
    
    // 计算文本位置
    let textAnchor = 'middle';
    let x = width / 2;
    if (currentSettings.textAlign === 'left') {
        textAnchor = 'start';
        x = 40;
    } else if (currentSettings.textAlign === 'right') {
        textAnchor = 'end';
        x = width - 40;
    }
    
    const lines = currentSettings.text.split('\n');
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = (height - totalHeight) / 2 + fontSize / 2;
    
    // 创建SVG内容
    let textElements = '';
    lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        
        // 处理大写转换
        let processedLine = line;
        if (currentSettings.textTransform.uppercase) {
            processedLine = line.toUpperCase();
        }
        
        // 构建变换属性
        let transform = '';
        if (currentSettings.textTransform.mirror || 
            currentSettings.textTransform.flip || 
            currentSettings.textTransform.rotate !== 0) {
            
            let transforms = [];
            if (currentSettings.textTransform.mirror) {
                transforms.push('scale(-1,1)');
            }
            if (currentSettings.textTransform.flip) {
                transforms.push('scale(1,-1)');
            }
            if (currentSettings.textTransform.rotate !== 0) {
                transforms.push(`rotate(${currentSettings.textTransform.rotate})`);
            }
            
            transform = `transform="${transforms.join(' ')}" transform-origin="center"`;
        }
        
        // 添加文本元素
        if (blur > 0) {
            textElements += `
                <text x="${x}" y="${y}" fill="${textColor}" text-anchor="${textAnchor}" 
                      font-family="${fontFamily}" font-size="${fontSize}px" font-weight="bold" 
                      filter="url(#blur)" ${transform}>${processedLine}</text>`;
        } else {
            textElements += `
                <text x="${x}" y="${y}" fill="${textColor}" text-anchor="${textAnchor}" 
                      font-family="${fontFamily}" font-size="${fontSize}px" font-weight="bold"
                      ${transform}>${processedLine}</text>`;
        }
    });
    
    // 构建完整的SVG
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="blur">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" />
                </filter>
            </defs>
            <rect width="100%" height="100%" fill="${bgColor}" rx="${currentSettings.borderRadius}" ry="${currentSettings.borderRadius}" />
            ${textElements}
        </svg>`;
}

// 确保导航栏可见的函数
function ensureNavigationVisible() {
    // 页面加载后确保导航栏可见
    const nav = document.querySelector('.main-nav');
    const navContainer = document.querySelector('.nav-container');
    const logo = document.querySelector('.logo');
    const navLinks = document.querySelector('.nav-links');
    
    if (nav) {
        nav.style.display = 'block';
        nav.style.visibility = 'visible';
        nav.style.position = 'fixed';
        nav.style.top = '0';
        nav.style.left = '0';
        nav.style.width = '100%';
        nav.style.zIndex = '2000';
    }
    
    if (navContainer) {
        navContainer.style.display = 'flex';
        navContainer.style.visibility = 'visible';
    }
    
    if (logo) {
        logo.style.display = 'block';
        logo.style.visibility = 'visible';
    }
    
    if (navLinks) {
        // 仅在非移动设备上显示导航链接
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
            navLinks.style.visibility = 'visible';
        }
    }
}

// DOMContentLoaded事件 - 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    ensureNavigationVisible();
    
    // 页面大小改变时再次检查
    window.addEventListener('resize', ensureNavigationVisible);
    
    // 每500毫秒检查一次导航栏是否可见，确保它在所有情况下都可见
    setTimeout(ensureNavigationVisible, 500);
    setTimeout(ensureNavigationVisible, 1000);
    
    // 确保导航栏和头部可见
    const introSection = document.querySelector('.intro-section');
    if (introSection) {
        introSection.style.display = 'block';
        introSection.style.visibility = 'visible';
    }
    
    // 调整页面内容的上边距，为固定导航栏留出空间
    const container = document.querySelector('.container');
    if (container && !container.style.marginTop) {
        container.style.marginTop = '80px';
    }
    
    // 初始化函数
    init();
    
    // 初始化FAQ折叠功能
    initFAQ();
    
    // 初始化导航菜单
    initNavMenu();
});

// FAQ折叠/展开功能
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // 关闭其他所有打开的FAQ项
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 切换当前项的状态
            item.classList.toggle('active');
        });
    });
}

// 导航菜单切换功能
function initNavMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // 切换图标
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('bi-list')) {
                icon.classList.remove('bi-list');
                icon.classList.add('bi-x-lg');
            } else {
                icon.classList.remove('bi-x-lg');
                icon.classList.add('bi-list');
            }
        });
        
        // 点击导航链接后关闭菜单
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('bi-x-lg');
                    icon.classList.add('bi-list');
                }
            });
        });
    }
} 