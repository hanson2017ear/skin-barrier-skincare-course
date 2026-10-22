# 从皮肤屏障看日常护肤中的过度清洁与保湿误区 补充材料

本材料配合中山大学公共选修课《皮肤保健与美容》的课程论文使用。中心问题是：日常清洁和保湿如何在满足需要的同时，保留皮肤屏障的稳定与耐受。

## 查看图示

1. [全文思维导图](figures/figure1_mindmap.png)：概括机制、误区和生活建议。
2. [皮肤屏障结构图](figures/figure2_skin_barrier.png)：区分角质细胞、细胞间脂质、NMF、皮脂膜与TEWL。
3. [护肤建议对照图](figures/figure3_skincare_advice.png)：把常见误区转成可执行的调整。

每张图同时提供PNG和保留文字的SVG。图示为原创建议性示意，不表示实验测量值。

## 其他补充材料

- [参考文献与核验说明](references.md)：正文6篇文献、用途及DOI/PMID。
- [课堂知识点与页码](classroom_notes.md)：采用PDF物理页码，并说明需要辨析的表述。
- [图注与导出说明](figure_notes.md)及[Mermaid源码](mindmap.mmd)。
- `scripts/`：自绘图与二维码生成脚本。

## 二维码入口

仓库首页：https://github.com/hanson2017ear/skin-barrier-skincare-course

补充材料已发布至上述公开仓库。二维码指向仓库首页，可查看三张图及可编辑原文件。若仓库名改变，重新运行二维码脚本并替换论文图片。

```text
python scripts/make_qr.py https://github.com/hanson2017ear/skin-barrier-skincare-course
```

所需依赖：`Pillow`、`reportlab`。`qr_target.txt`保存实际编码的链接，`qr_status.json`记录当前状态。二维码只提供补充入口，论文正文完整保留论证内容。

## 来源与使用

图示根据课堂知识与列出的公开文献重新绘制。原始课程文件和文献全文保留在本地阅读记录中；此材料包包含自绘图、书目信息、知识点页码索引和脚本。图示辅助理解日常护理，不承担个体诊断功能。

辅助工具：Codex用于资料整理、文字初拟、自绘图排版与核验记录。当前审阅为AI辅助自审，没有独立临床专家审稿或学校查重结果。核验日期：2026年10月22日。
