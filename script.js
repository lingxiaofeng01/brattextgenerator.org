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
let isInitialized = false;

// 主初始化函数
function init() {
    console.log('初始化开始...');
    
    // 防止重复初始化
    if (isInitialized) {
        console.log('已初始化，跳过');
        return;
    }
    
    // 验证核心元素是否存在
    if (!textInput || !textPreview || !previewPanel) {
        console.error('关键DOM元素未找到，无法初始化');
        return;
    }
    
    // 设置初始文本
    textPreview.textContent = defaultSettings.text;
    
    // 初始化预览面板
    previewPanel.style.backgroundColor = defaultSettings.bgColor;
    previewPanel.style.borderRadius = `${defaultSettings.borderRadius}px`;
    previewPanel.style.width = `${defaultSettings.canvasWidth}px`;
    previewPanel.style.height = `${defaultSettings.canvasHeight}px`;
    
    // 初始化对齐按钮状态
    updateAlignButtons(defaultSettings.textAlign);
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始更新预览
    updatePreview();
    
    // 设置初始化标志
    isInitialized = true;
    console.log('初始化完成');
}

// 绑定所有事件监听器
function bindEventListeners() {
    // 文本输入事件
    textInput.addEventListener('input', function() {
        currentSettings.text = this.value;
        textPreview.textContent = currentSettings.text;
    });
    
    // 字体大小事件
    fontSizeSlider.addEventListener('input', function() {
        currentSettings.fontSize = parseInt(this.value);
        updatePreview();
    });
    
    // 文本颜色事件
    textColorPicker.addEventListener('input', function() {
        currentSettings.textColor = this.value;
        updatePreview();
    });
    
    // 背景颜色事件
    bgColorPicker.addEventListener('input', function() {
        currentSettings.bgColor = this.value;
        updatePreview();
        // 清除预设选中状态
        presets.forEach(p => p.classList.remove('active'));
    });
    
    // 模糊效果事件
    blurEffectSlider.addEventListener('input', function() {
        currentSettings.blurEffect = parseFloat(this.value);
        updatePreview();
    });
    
    // 边框圆角事件
    borderRadiusSlider.addEventListener('input', function() {
        currentSettings.borderRadius = parseInt(this.value);
        updatePreview();
    });
    
    // 文本阴影事件
    textShadowSlider.addEventListener('input', function() {
        currentSettings.textShadow = parseInt(this.value);
        updatePreview();
    });
    
    // 画布尺寸事件
    canvasWidthInput.addEventListener('change', function() {
        currentSettings.canvasWidth = parseInt(this.value);
        updatePreview();
    });
    
    canvasHeightInput.addEventListener('change', function() {
        currentSettings.canvasHeight = parseInt(this.value);
        updatePreview();
    });
    
    // 对齐按钮事件
    alignLeftBtn.addEventListener('click', function() {
        setTextAlign('left');
    });
    
    alignCenterBtn.addEventListener('click', function() {
        setTextAlign('center');
    });
    
    alignRightBtn.addEventListener('click', function() {
        setTextAlign('right');
    });
    
    // 文本变换按钮事件
    textMirrorBtn.addEventListener('click', toggleTextMirror);
    textFlipBtn.addEventListener('click', toggleTextFlip);
    textRotateBtn.addEventListener('click', toggleTextRotate);
    textUppercaseBtn.addEventListener('click', toggleTextUppercase);
    
    // 预设按钮事件
    presets.forEach(preset => {
        preset.addEventListener('click', handlePresetClick);
    });
    
    // 缩放控制事件
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    zoomResetBtn.addEventListener('click', resetZoom);
    
    // 重置按钮事件
    resetButton.addEventListener('click', resetSettings);
    
    // 下载按钮事件
    downloadPngButton.addEventListener('click', function() {
        downloadImage('png');
    });
    
    downloadJpgButton.addEventListener('click', function() {
        downloadImage('jpg');
    });
    
    downloadSvgButton.addEventListener('click', function() {
        downloadImage('svg');
    });
}

// 更新预览函数
function updatePreview() {
    // 更新文本样式
    textPreview.style.fontSize = `${currentSettings.fontSize}px`;
    textPreview.style.color = currentSettings.textColor;
    textPreview.style.filter = `blur(${currentSettings.blurEffect}px)`;
    textPreview.style.textShadow = `0 0 ${currentSettings.textShadow}px ${currentSettings.textColor}`;
    textPreview.style.textAlign = currentSettings.textAlign;
    
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
    textPreview.style.textTransform = currentSettings.textTransform.uppercase ? 'uppercase' : 'none';
    
    // 更新预览面板
    previewPanel.style.backgroundColor = currentSettings.bgColor;
    previewPanel.style.borderRadius = `${currentSettings.borderRadius}px`;
    previewPanel.style.width = `${currentSettings.canvasWidth}px`;
    previewPanel.style.height = `${currentSettings.canvasHeight}px`;
    
    // 应用缩放
    const scale = zoomLevel / 100;
    previewWrapper.style.transform = `scale(${scale})`;
    
    // 更新显示值
    fontSizeValue.textContent = `${currentSettings.fontSize}px`;
    blurEffectValue.textContent = `${currentSettings.blurEffect}px`;
    borderRadiusValue.textContent = `${currentSettings.borderRadius}px`;
    textShadowValue.textContent = `${currentSettings.textShadow}px`;
    zoomLevelDisplay.textContent = `${zoomLevel}%`;
}

// 文本对齐函数
function setTextAlign(align) {
    currentSettings.textAlign = align;
    updateAlignButtons(align);
    updatePreview();
}

// 更新对齐按钮状态
function updateAlignButtons(align) {
    alignLeftBtn.classList.remove('active');
    alignCenterBtn.classList.remove('active');
    alignRightBtn.classList.remove('active');
    
    if (align === 'left') {
        alignLeftBtn.classList.add('active');
    } else if (align === 'right') {
        alignRightBtn.classList.add('active');
    } else {
        alignCenterBtn.classList.add('active');
    }
}

// 文本变换函数
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
    const rotationValues = [0, 90, 180, 270];
    const currentIndex = rotationValues.indexOf(currentSettings.textTransform.rotate);
    const nextIndex = (currentIndex + 1) % rotationValues.length;
    currentSettings.textTransform.rotate = rotationValues[nextIndex];
    
    updateButtonState(textRotateBtn, currentSettings.textTransform.rotate !== 0);
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

// 处理预设点击
function handlePresetClick(event) {
    const preset = event.currentTarget;
    
    // 更新预设按钮状态
    presets.forEach(p => p.classList.remove('active'));
    preset.classList.add('active');
    
    // 应用相应的颜色
    if (preset.classList.contains('preset-green')) {
        currentSettings.bgColor = '#8AE403';
    } else if (preset.classList.contains('preset-white')) {
        currentSettings.bgColor = '#FFFFFF';
    } else if (preset.classList.contains('preset-pink')) {
        currentSettings.bgColor = '#FF97EA';
    } else if (preset.classList.contains('preset-blue')) {
        currentSettings.bgColor = '#97EAFF';
    }
    
    // 更新颜色选择器值
    bgColorPicker.value = currentSettings.bgColor;
    updatePreview();
}

// 缩放功能
function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 10, 200);
    updatePreview();
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 10, 50);
    updatePreview();
}

function resetZoom() {
    zoomLevel = 100;
    updatePreview();
}

// 重置设置
function resetSettings() {
    currentSettings = {...defaultSettings};
    zoomLevel = 100;
    
    // 重置输入元素值
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
    updateAlignButtons(defaultSettings.textAlign);
    updateButtonState(textMirrorBtn, false);
    updateButtonState(textFlipBtn, false);
    updateButtonState(textRotateBtn, false);
    updateButtonState(textUppercaseBtn, false);
    
    // 重置预设按钮
    presets.forEach(preset => preset.classList.remove('active'));
    document.querySelector('.preset-green').classList.add('active');
    
    // 更新预览
    updatePreview();
}

// 下载图像功能
function downloadImage(format = 'png') {
    if (format === 'svg') {
        // SVG导出
        try {
            const svgContent = createSVG();
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `brat-text.svg`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error('SVG导出失败:', error);
            alert('SVG导出失败，请尝试其他格式。');
        }
        return;
    }
    
    // PNG和JPG导出需要html2canvas
    if (typeof html2canvas === 'undefined') {
        // 动态加载html2canvas
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = function() {
            processCanvasExport();
        };
        script.onerror = function() {
            alert('无法加载必要的库，请检查您的网络连接后重试。');
        };
        document.head.appendChild(script);
    } else {
        processCanvasExport();
    }
    
    // 处理Canvas导出
    function processCanvasExport() {
        const options = {
            scale: 2,
            useCORS: true,
            backgroundColor: currentSettings.bgColor
        };
        
        html2canvas(previewPanel, options).then(canvas => {
            let dataURL;
            if (format === 'jpg') {
                dataURL = canvas.toDataURL('image/jpeg', 0.9);
            } else {
                dataURL = canvas.toDataURL('image/png');
            }
            
            const downloadLink = document.createElement('a');
            downloadLink.href = dataURL;
            downloadLink.download = `brat-text.${format}`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }).catch(error => {
            console.error('画布渲染失败:', error);
            alert('图像导出失败，请重试。');
        });
    }
}

// 创建SVG
function createSVG() {
    const width = currentSettings.canvasWidth;
    const height = currentSettings.canvasHeight;
    const text = currentSettings.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const fontSize = currentSettings.fontSize;
    const textColor = currentSettings.textColor;
    const bgColor = currentSettings.bgColor;
    const blur = currentSettings.blurEffect;
    const borderRadius = currentSettings.borderRadius;
    
    // 处理文本对齐
    let textAnchor = 'middle';
    let x = width / 2;
    if (currentSettings.textAlign === 'left') {
        textAnchor = 'start';
        x = 20;
    } else if (currentSettings.textAlign === 'right') {
        textAnchor = 'end';
        x = width - 20;
    }
    
    // 创建SVG内容
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" />
            </filter>
        </defs>
        <rect width="100%" height="100%" fill="${bgColor}" rx="${borderRadius}" ry="${borderRadius}" />
        <text 
            x="${x}" 
            y="${height/2}" 
            font-family="Arial, sans-serif" 
            font-size="${fontSize}px" 
            fill="${textColor}" 
            text-anchor="${textAnchor}"
            ${blur > 0 ? 'filter="url(#blur)"' : ''}
            ${currentSettings.textShadow > 0 ? `style="filter: drop-shadow(0 0 ${currentSettings.textShadow}px ${textColor});"` : ''}
        >${text}</text>
    </svg>`;
}

// 导航和FAQ功能初始化
function initUI() {
    // 初始化FAQ折叠功能
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems && faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    item.classList.toggle('active');
                });
            }
        });
    }
    
    // 初始化移动导航菜单
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            const isVisible = navLinks.classList.contains('show');
            navLinks.classList.toggle('show');
            navLinks.style.display = isVisible ? 'none' : 'flex';
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化工具功能
    init();
    
    // 初始化UI组件
    initUI();
}); 