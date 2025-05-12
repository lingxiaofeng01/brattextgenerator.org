// DOM元素
let textInput, textPreview, fontSizeSlider, fontSizeValue, textColorPicker, bgColorPicker;
let blurEffectSlider, blurEffectValue, borderRadiusSlider, borderRadiusValue;
let canvasWidthInput, canvasHeightInput, previewPanel, textShadowSlider, textShadowValue;
let resetButton, downloadPngButton, downloadJpgButton, downloadSvgButton;
let alignLeftBtn, alignCenterBtn, alignRightBtn, textMirrorBtn, textFlipBtn;
let textRotateBtn, textUppercaseBtn, presets, zoomInBtn, zoomOutBtn;
let zoomResetBtn, zoomLevelDisplay, previewWrapper, headerElement;

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
let html2canvasLoaded = false;

// DOM元素初始化函数 - 延迟获取DOM元素以提高初始加载速度
function initDOMElements() {
    textInput = document.getElementById('text-input');
    textPreview = document.getElementById('text-preview');
    fontSizeSlider = document.getElementById('font-size');
    fontSizeValue = document.getElementById('font-size-value');
    textColorPicker = document.getElementById('text-color');
    bgColorPicker = document.getElementById('bg-color');
    blurEffectSlider = document.getElementById('blur-effect');
    blurEffectValue = document.getElementById('blur-effect-value');
    borderRadiusSlider = document.getElementById('border-radius');
    borderRadiusValue = document.getElementById('border-radius-value');
    canvasWidthInput = document.getElementById('canvas-width');
    canvasHeightInput = document.getElementById('canvas-height');
    previewPanel = document.getElementById('preview-panel');
    textShadowSlider = document.getElementById('text-shadow');
    textShadowValue = document.getElementById('text-shadow-value');
    resetButton = document.getElementById('reset-button');
    downloadPngButton = document.getElementById('download-png');
    downloadJpgButton = document.getElementById('download-jpg');
    downloadSvgButton = document.getElementById('download-svg');
    alignLeftBtn = document.getElementById('align-left');
    alignCenterBtn = document.getElementById('align-center');
    alignRightBtn = document.getElementById('align-right');
    textMirrorBtn = document.getElementById('text-mirror');
    textFlipBtn = document.getElementById('text-flip');
    textRotateBtn = document.getElementById('text-rotate');
    textUppercaseBtn = document.getElementById('text-uppercase');
    presets = document.querySelectorAll('.preset');
    zoomInBtn = document.getElementById('zoom-in');
    zoomOutBtn = document.getElementById('zoom-out');
    zoomResetBtn = document.getElementById('zoom-reset');
    zoomLevelDisplay = document.getElementById('zoom-level');
    previewWrapper = document.querySelector('.preview-wrapper');
    headerElement = document.querySelector('header');
}

// 主初始化函数 - 使用RAF保证在渲染周期内执行初始化
function init() {
    if (isInitialized) return;
    
    // 获取DOM元素
    initDOMElements();
        
    // 验证核心元素是否存在
    if (!textInput || !textPreview || !previewPanel) {
        console.error('关键DOM元素未找到，无法初始化');
        return;
    }
    
    // 设置初始文本
    if (textPreview) textPreview.textContent = defaultSettings.text;
    
    // 使用requestAnimationFrame初始化UI，避免阻塞主线程
    requestAnimationFrame(() => {
        // 初始化预览面板
        if (previewPanel) {
            previewPanel.style.backgroundColor = defaultSettings.bgColor;
            previewPanel.style.borderRadius = `${defaultSettings.borderRadius}px`;
            previewPanel.style.width = `${defaultSettings.canvasWidth}px`;
            previewPanel.style.height = `${defaultSettings.canvasHeight}px`;
        }
        
        // 初始化对齐按钮状态
        updateAlignButtons(defaultSettings.textAlign);
        
        // 绑定事件监听器 - 使用事件委托减少事件监听器数量
        bindEventListeners();
        
        // 初始更新预览
        updatePreview();
        
        // 设置初始化标志
        isInitialized = true;
    });
        
    // 预加载html2canvas以备导出功能使用
    if ('IntersectionObserver' in window) {
        // 使用交叉观察器延迟加载html2canvas
        const exportSection = document.querySelector('.download-options');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !html2canvasLoaded) {
                    loadHtml2Canvas();
                    observer.disconnect();
                }
            });
        }, {rootMargin: '200px'});
    
        if (exportSection) observer.observe(exportSection);
    } else {
        // 如果不支持交叉观察器，在页面空闲时加载
        window.addEventListener('load', () => {
            setTimeout(loadHtml2Canvas, 2000);
        });
    }
    }
    
// 延迟加载html2canvas库
function loadHtml2Canvas() {
    if (html2canvasLoaded) return;
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    script.async = true;
    script.onload = () => {
        html2canvasLoaded = true;
    };
    document.head.appendChild(script);
}

// 绑定所有事件监听器 - 使用事件委托减少监听器数量
function bindEventListeners() {
    // 使用事件委托处理控制面板的所有输入事件
    const leftPanel = document.querySelector('.left-panel');
    if (leftPanel) {
        leftPanel.addEventListener('input', handleControlsInput);
        leftPanel.addEventListener('change', handleControlsChange);
        leftPanel.addEventListener('click', handleControlsClick);
    }
    
    // 单独绑定文本输入事件 - 这个需要即时响应
    if (textInput) {
        textInput.addEventListener('input', debounce(function() {
            currentSettings.text = this.value;
            if (textPreview) textPreview.textContent = currentSettings.text;
        }, 10)); // 微小延迟防止频繁更新
    }
    
    // 绑定缩放控制事件
    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetZoom);
        
    // 绑定下载按钮事件
    if (downloadPngButton) downloadPngButton.addEventListener('click', () => downloadImage('png'));
    if (downloadJpgButton) downloadJpgButton.addEventListener('click', () => downloadImage('jpg'));
    if (downloadSvgButton) downloadSvgButton.addEventListener('click', () => downloadImage('svg'));
        
    // 重置按钮事件
    if (resetButton) resetButton.addEventListener('click', resetSettings);
}

// 事件委托处理输入事件
function handleControlsInput(e) {
    const target = e.target;
    
    if (target === fontSizeSlider) {
        currentSettings.fontSize = parseInt(target.value);
        requestAnimationFrame(updatePreview);
}
    else if (target === textColorPicker) {
        currentSettings.textColor = target.value;
        requestAnimationFrame(updatePreview);
    }
    else if (target === bgColorPicker) {
        currentSettings.bgColor = target.value;
        // 清除预设选中状态
        presets.forEach(p => p.classList.remove('active'));
        requestAnimationFrame(updatePreview);
    }
    else if (target === blurEffectSlider) {
        currentSettings.blurEffect = parseFloat(target.value);
        requestAnimationFrame(updatePreview);
    }
    else if (target === borderRadiusSlider) {
        currentSettings.borderRadius = parseInt(target.value);
        requestAnimationFrame(updatePreview);
    }
    else if (target === textShadowSlider) {
        currentSettings.textShadow = parseInt(target.value);
        requestAnimationFrame(updatePreview);
    }
}

// 事件委托处理变更事件
function handleControlsChange(e) {
    const target = e.target;
    
    if (target === canvasWidthInput) {
        currentSettings.canvasWidth = parseInt(target.value);
        requestAnimationFrame(updatePreview);
    }
    else if (target === canvasHeightInput) {
        currentSettings.canvasHeight = parseInt(target.value);
        requestAnimationFrame(updatePreview);
    }
}

// 事件委托处理点击事件
function handleControlsClick(e) {
    const target = e.target;
    
    // 找到最近的按钮元素（处理点击图标的情况）
    const button = target.closest('button');
    if (!button) return;
    
    if (button === alignLeftBtn) {
        setTextAlign('left');
    }
    else if (button === alignCenterBtn) {
        setTextAlign('center');
    }
    else if (button === alignRightBtn) {
        setTextAlign('right');
    }
    else if (button === textMirrorBtn) {
        toggleTextMirror();
    }
    else if (button === textFlipBtn) {
        toggleTextFlip();
    }
    else if (button === textRotateBtn) {
        toggleTextRotate();
    }
    else if (button === textUppercaseBtn) {
        toggleTextUppercase();
    }
    else if (button.classList.contains('preset')) {
        handlePresetClick(button);
    }
}

// 去抖动函数 - 减少频繁更新
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 使用RAF优化预览更新 - 确保视觉变化在渲染帧上进行
const updatePreview = debounce(function() {
    if (!textPreview || !previewPanel) return;
    
    // 批量更新DOM属性，减少重排和重绘
    const textStyles = {
        fontSize: `${currentSettings.fontSize}px`,
        color: currentSettings.textColor,
        filter: `blur(${currentSettings.blurEffect}px)`,
        textShadow: `0 0 ${currentSettings.textShadow}px ${currentSettings.textColor}`,
        textAlign: currentSettings.textAlign
    };
    
    // 计算变换
    let transforms = [];
    if (currentSettings.textTransform.mirror) transforms.push('scaleX(-1)');
    if (currentSettings.textTransform.flip) transforms.push('scaleY(-1)');
    if (currentSettings.textTransform.rotate !== 0) transforms.push(`rotate(${currentSettings.textTransform.rotate}deg)`);
    textStyles.transform = transforms.length ? transforms.join(' ') : 'none';
    
    // 应用大写转换
    textStyles.textTransform = currentSettings.textTransform.uppercase ? 'uppercase' : 'none';
    
    // 批量应用样式 - 减少回流
    requestAnimationFrame(() => {
        // 应用文本样式
        Object.assign(textPreview.style, textStyles);
        
        // 更新预览面板
        Object.assign(previewPanel.style, {
            backgroundColor: currentSettings.bgColor,
            borderRadius: `${currentSettings.borderRadius}px`,
            width: `${currentSettings.canvasWidth}px`,
            height: `${currentSettings.canvasHeight}px`
        });
    
        // 应用缩放
    const scale = zoomLevel / 100;
        if (previewWrapper) previewWrapper.style.transform = `scale(${scale})`;
    
    // 更新显示值
        if (fontSizeValue) fontSizeValue.textContent = `${currentSettings.fontSize}px`;
        if (blurEffectValue) blurEffectValue.textContent = `${currentSettings.blurEffect}px`;
        if (borderRadiusValue) borderRadiusValue.textContent = `${currentSettings.borderRadius}px`;
        if (textShadowValue) textShadowValue.textContent = `${currentSettings.textShadow}px`;
        if (zoomLevelDisplay) zoomLevelDisplay.textContent = `${zoomLevel}%`;
    });
}, 16); // 约60fps的更新频率

// 文本对齐函数
function setTextAlign(align) {
    currentSettings.textAlign = align;
    updateAlignButtons(align);
    requestAnimationFrame(updatePreview);
}
    
// 更新对齐按钮状态
function updateAlignButtons(align) {
    if (!alignLeftBtn || !alignCenterBtn || !alignRightBtn) return;
    
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
    requestAnimationFrame(updatePreview);
}

function toggleTextFlip() {
    currentSettings.textTransform.flip = !currentSettings.textTransform.flip;
    updateButtonState(textFlipBtn, currentSettings.textTransform.flip);
    requestAnimationFrame(updatePreview);
}

function toggleTextRotate() {
    const rotationValues = [0, 90, 180, 270];
    const currentIndex = rotationValues.indexOf(currentSettings.textTransform.rotate);
    const nextIndex = (currentIndex + 1) % rotationValues.length;
    currentSettings.textTransform.rotate = rotationValues[nextIndex];
    
    updateButtonState(textRotateBtn, currentSettings.textTransform.rotate !== 0);
    requestAnimationFrame(updatePreview);
}

function toggleTextUppercase() {
    currentSettings.textTransform.uppercase = !currentSettings.textTransform.uppercase;
    updateButtonState(textUppercaseBtn, currentSettings.textTransform.uppercase);
    requestAnimationFrame(updatePreview);
}

// 更新按钮状态
function updateButtonState(button, isActive) {
    if (!button) return;
    
    if (isActive) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }
}

// 处理预设点击
function handlePresetClick(preset) {
    if (!preset || !presets) return;
    
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
    
    // 确保颜色选择器的值被更新
    if (bgColorPicker) {
        bgColorPicker.value = currentSettings.bgColor;
    }
    
    // 立即更新预览
    updatePreview();
    
    // 直接设置预览面板的背景色，以确保立即生效
    if (previewPanel) {
        previewPanel.style.backgroundColor = currentSettings.bgColor;
    }
}

// 缩放功能
function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 10, 200);
    requestAnimationFrame(updatePreview);
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 10, 50);
    requestAnimationFrame(updatePreview);
}

function resetZoom() {
    zoomLevel = 100;
    requestAnimationFrame(updatePreview);
}

// 重置设置
function resetSettings() {
    currentSettings = {...defaultSettings};
    zoomLevel = 100;
    
    // 批量更新DOM元素，减少重排操作
    requestAnimationFrame(() => {
        // 重置输入元素值
        if (textInput) textInput.value = defaultSettings.text;
        if (fontSizeSlider) fontSizeSlider.value = defaultSettings.fontSize;
        if (textColorPicker) textColorPicker.value = defaultSettings.textColor;
        if (bgColorPicker) bgColorPicker.value = defaultSettings.bgColor;
        if (blurEffectSlider) blurEffectSlider.value = defaultSettings.blurEffect;
        if (borderRadiusSlider) borderRadiusSlider.value = defaultSettings.borderRadius;
        if (canvasWidthInput) canvasWidthInput.value = defaultSettings.canvasWidth;
        if (canvasHeightInput) canvasHeightInput.value = defaultSettings.canvasHeight;
        if (textShadowSlider) textShadowSlider.value = defaultSettings.textShadow;
    
        // 重置按钮状态
        updateAlignButtons(defaultSettings.textAlign);
        updateButtonState(textMirrorBtn, false);
        updateButtonState(textFlipBtn, false);
        updateButtonState(textRotateBtn, false);
        updateButtonState(textUppercaseBtn, false);
        
        // 重置预设按钮
        if (presets) {
            presets.forEach(preset => preset.classList.remove('active'));
            const greenPreset = document.querySelector('.preset-green');
            if (greenPreset) greenPreset.classList.add('active');
        }
        
        // 更新预览
        updatePreview();
    });
}

// 下载图像功能 - 使用Promise优化异步操作
function downloadImage(format = 'png') {
    if (format === 'svg') {
        // SVG导出
        try {
            const svgContent = createSVG();
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            downloadFile(url, `brat-text.svg`);
            
            // 及时释放URL对象
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error('SVG导出失败:', error);
            alert('SVG导出失败，请尝试其他格式。');
            }
        return;
    }
    
    // PNG和JPG导出
    if (typeof html2canvas === 'undefined') {
        // 如果尚未加载，立即加载并使用
        if (!html2canvasLoaded) {
            const loadingMessage = document.createElement('div');
            loadingMessage.textContent = '正在准备导出功能...';
            loadingMessage.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:15px;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,0.2);z-index:9999;';
            document.body.appendChild(loadingMessage);
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
            script.onload = function() {
                html2canvasLoaded = true;
                document.body.removeChild(loadingMessage);
                processCanvasExport();
            };
            script.onerror = function() {
                document.body.removeChild(loadingMessage);
                alert('无法加载必要的库，请检查您的网络连接后重试。');
            };
            document.head.appendChild(script);
        }
        } else {
        processCanvasExport();
        }
        
    // 处理Canvas导出
    function processCanvasExport() {
        if (!previewPanel) return;
        
        const options = {
            scale: 2, // 提高导出质量
            useCORS: true,
            backgroundColor: currentSettings.bgColor,
            logging: false, // 减少控制台输出
            allowTaint: true // 允许跨域图像
        };
        
        html2canvas(previewPanel, options).then(canvas => {
            let dataURL;
            if (format === 'jpg') {
                dataURL = canvas.toDataURL('image/jpeg', 0.9);
                } else {
                dataURL = canvas.toDataURL('image/png');
        }
        
            downloadFile(dataURL, `brat-text.${format}`);
        }).catch(error => {
            console.error('画布渲染失败:', error);
            alert('图像导出失败，请重试。');
        });
    }
}

// 下载文件辅助函数
function downloadFile(url, filename) {
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // 清理DOM
    setTimeout(() => {
    document.body.removeChild(downloadLink);
    }, 100);
}

// 创建SVG - 优化SVG生成过程
function createSVG() {
    const width = currentSettings.canvasWidth;
    const height = currentSettings.canvasHeight;
    const text = (currentSettings.text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
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
    
    // 创建SVG内容 - 使用模板字符串增强可读性和性能
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

// 导航和FAQ功能初始化 - 延迟初始化非关键UI功能
function initUI() {
    // 使用事件委托处理FAQ折叠功能
    const faqSection = document.querySelector('.faq-container');
    if (faqSection) {
        faqSection.addEventListener('click', (e) => {
            const question = e.target.closest('.faq-question');
            if (question) {
                const item = question.parentElement;
                if (item) item.classList.toggle('active');
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

// 根据浏览器空闲时间初始化非关键UI功能
function initSecondaryFeatures() {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initUI(), { timeout: 2000 });
    } else {
        // 回退方案
        setTimeout(initUI, 500);
    }
}

// 页面加载完成后初始化 - 使用DOMContentLoaded事件快速启动核心功能
document.addEventListener('DOMContentLoaded', function() {
    // 优先初始化核心功能
    init();
    
    // 延迟初始化次要UI功能
    initSecondaryFeatures();
    
    // 初始化移动优化
    optimizeForMobile();
    
    // 监听窗口调整大小
    window.addEventListener('resize', debounce(function() {
        optimizeForMobile();
    }, 250));
    
    // 移动端菜单切换
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
        
        // 点击导航链接时关闭菜单
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('show');
                }
            });
        });
        
        // 点击页面其他地方关闭菜单
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                navLinks.classList.remove('show');
            }
        });
    }
});

// 添加资源预加载提示
if (document.currentScript) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    document.head.appendChild(link);
}

// 添加快速响应触摸事件处理
function enhanceMobileTouchResponse() {
    // 获取所有可交互元素
    const interactiveElements = document.querySelectorAll('button, a, input, select, .control-option, .color-option');
    
    // 添加触摸反馈
    interactiveElements.forEach(element => {
        // 添加触摸开始时的视觉反馈
        element.addEventListener('touchstart', function(e) {
            this.classList.add('touch-active');
        }, {passive: true});
        
        // 触摸结束后移除视觉反馈
        element.addEventListener('touchend', function(e) {
            this.classList.remove('touch-active');
        }, {passive: true});
        
        // 触摸取消时也移除视觉反馈
        element.addEventListener('touchcancel', function(e) {
            this.classList.remove('touch-active');
        }, {passive: true});
    });
    
    // 优化滚动性能
    const scrollableElements = document.querySelectorAll('.scrollable');
    scrollableElements.forEach(el => {
        el.style.webkitOverflowScrolling = 'touch';
        el.addEventListener('touchstart', function() {}, {passive: true});
    });
}

// 添加移动端性能优化
function optimizeForMobile() {
    // 检测是否为移动设备
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // 调整预览容器大小
        const previewWrapper = document.querySelector('.preview-wrapper');
        const preview = document.querySelector('.preview');
        
        if (previewWrapper && preview) {
            // 设置预览容器高度适应屏幕宽度
            const screenWidth = window.innerWidth - 40; // 考虑边距
            const previewScale = screenWidth / preview.offsetWidth;
            preview.style.transform = `scale(${previewScale})`;
            
            // 调整预览容器高度以适应缩放后的预览
            const scaledHeight = preview.offsetHeight * previewScale;
            previewWrapper.style.height = `${scaledHeight}px`;
        }
        
        // 简化动画效果以提高性能
        document.body.classList.add('mobile-optimized');
        
        // 增强触摸响应
        enhanceMobileTouchResponse();
        
        // 减少不必要的计算和重绘
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                const nonCriticalElements = document.querySelectorAll('.non-critical');
                nonCriticalElements.forEach(el => {
                    el.classList.add('deferred-load');
                });
            });
        }
    } else {
        // PC端恢复正常显示
        const preview = document.querySelector('.preview');
        if (preview) {
            preview.style.transform = 'none';
        }
        
        // 移除移动优化类
        document.body.classList.remove('mobile-optimized');
    }
} 