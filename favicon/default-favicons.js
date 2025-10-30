const fs = require('fs');
const { createCanvas } = require('canvas');

// 创建不同尺寸的favicon
const sizes = [16, 32, 192, 180];
const fileNames = {
    16: 'favicon-16x16.png',
    32: 'favicon-32x32.png',
    192: 'icon-192x192.png',
    180: 'apple-touch-icon.png'
};

// Brat风格的颜色
const bgColor = '#8AE403';  // 经典Brat绿色
const textColor = '#000000'; // 黑色文本
const text = 'B';

// 为每个尺寸生成图像
sizes.forEach(size => {
    // 创建画布
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // 绘制背景
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    
    // 设置文本样式
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 根据尺寸调整字体大小
    const fontSize = Math.floor(size * 0.6);
    ctx.font = `bold ${fontSize}px Arial`;
    
    // 添加模糊效果 (只对较大尺寸)
    if (size >= 32) {
        ctx.shadowColor = textColor;
        ctx.shadowBlur = size / 16;
    }
    
    // 绘制文本
    ctx.fillText(text, size/2, size/2);
    
    // 将画布保存为PNG文件
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`../${fileNames[size]}`, buffer);
    console.log(`生成了 ${fileNames[size]}`);
});

console.log('所有图标已生成完成。');
console.log('提示：你需要使用专门工具将16x16和32x32的PNG文件转换为favicon.ico'); 