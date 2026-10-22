# 图示说明与插入位置

三张均为新绘示意图，使用统一的白底、低饱和配色及中文标签；PNG为300 dpi，SVG保留可编辑文字。不是课件截图，也不是定量实验结果。

## 图1

建议位置：引言后、第一节前。

图1 全文思维导图。以屏障稳定为中心，联系清洁、保湿、常见误区和生活中的护理选择。

文件：`figures/figure1_mindmap.png`、`figures/figure1_mindmap.svg`。

## 图2

建议位置：第一节机制解释后。

图2 皮肤屏障结构与水分流失示意图。角质细胞与细胞间脂质形成砖墙样结构，NMF位于角质细胞内，皮脂膜位于表面；TEWL箭头仅表示扩散方向。根据课堂知识及文献[1][2]自绘，不按比例。

文件：`figures/figure2_skin_barrier.png`、`figures/figure2_skin_barrier.svg`。

## 图3

建议位置：第四节防晒段后、结尾认识前。

图3 常见护肤误区与科学建议对照。清洁与保湿应结合肤质、部位、环境和耐受调整，持续不适时应就诊。

文件：`figures/figure3_skincare_advice.png`、`figures/figure3_skincare_advice.svg`。

## 思维导图源码与导出

`mindmap.mmd`为Mermaid思维导图源码，结构与图1一致；为了在Word中稳定显示，交付的图1使用同一结构手工排成SVG和PNG，版式不依赖Mermaid主题。可在支持Mermaid的编辑器中粘贴源码并导出SVG/PNG；或安装Mermaid CLI后运行：

```text
npx -p @mermaid-js/mermaid-cli mmdc -i mindmap.mmd -o mindmap.svg -b white
```

若导出PNG，可把输出扩展名改为`.png`并指定`-s 3`。确保渲染环境安装中文字体；Mermaid自动布局与交付图1的排版会有差异。

## 可复现的自绘图

运行`python scripts/build_figures.py`会从一个布局源生成三组PNG与SVG。默认字体为微软雅黑或Noto Sans CJK；如本机路径不同，修改字体选择函数。图中的箭头、标签和边界已在最终图片中逐一核对。

矢量审查检查了字体、画布范围和禁用构造；仅有“180 mm不是Nature的89/183 mm”的提示。此为课程论文，180 mm的原图宽度是有意选择，Word中按页宽缩放；不将该提示当作课程格式错误。
