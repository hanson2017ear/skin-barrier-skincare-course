"""Build three original course-essay diagrams from one editable layout."""
from pathlib import Path
from xml.sax.saxutils import escape
from math import atan2, cos, sin, pi
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'figures'
OUT.mkdir(exist_ok=True)
W = 510.24  # 180 mm
SCALE = 300 / 72
INK = '#20323d'
TEAL = '#356b79'
GRAY = '#74838a'
PALE = '#eef4f5'
SAND = '#f3eee5'

def font_path():
    candidates = [
        Path(os.environ.get('WINDIR', 'C:/Windows'))/'Fonts/msyh.ttc',
        Path('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'),
    ]
    for p in candidates:
        if p.exists(): return p
    raise FileNotFoundError('Install a CJK font or edit font_path() to select one.')

FONT = font_path()

class Diagram:
    def __init__(self, height):
        self.h = height
        self.svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="180mm" height="{height/W*180:.4f}mm" viewBox="0 0 {W} {height}">',
                    '<rect width="100%" height="100%" fill="white"/>']
        self.image = Image.new('RGB', (round(W*SCALE), round(height*SCALE)), 'white')
        self.draw = ImageDraw.Draw(self.image)

    def rect(self,x,y,w,h,fill=PALE,stroke='#b9c8cd',radius=3):
        self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="0.7"/>')
        self.draw.rounded_rectangle(tuple(round(v*SCALE) for v in (x,y,x+w,y+h)), radius=round(radius*SCALE), fill=fill, outline=stroke, width=3)

    def line(self,points,color=GRAY,width=.8):
        pts=' '.join(f'{x},{y}' for x,y in points)
        self.svg.append(f'<polyline points="{pts}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round"/>')
        self.draw.line([(round(x*SCALE),round(y*SCALE)) for x,y in points],fill=color,width=max(1,round(width*SCALE)),joint='curve')

    def arrow(self,points,color=TEAL,width=1):
        self.line(points,color,width)
        x,y=points[-1]; px,py=points[-2]
        a=atan2(y-py,x-px)
        tri=[(x,y),(x-5*cos(a-pi/7),y-5*sin(a-pi/7)),(x-5*cos(a+pi/7),y-5*sin(a+pi/7))]
        self.svg.append('<polygon points="'+' '.join(f'{u},{v}' for u,v in tri)+f'" fill="{color}"/>')
        self.draw.polygon([(round(u*SCALE),round(v*SCALE)) for u,v in tri],fill=color)

    def circle(self,x,y,r,color=TEAL):
        self.svg.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}"/>')
        self.draw.ellipse(tuple(round(v*SCALE) for v in (x-r,y-r,x+r,y+r)),fill=color)

    def text(self,x,y,content,size=10,anchor='middle',color=INK,bold=False):
        # Exact CJK labels remain editable text in the SVG.
        f=ImageFont.truetype(str(FONT),round(size*SCALE))
        lines=content.split('\n')
        for i,t in enumerate(lines):
            yy=y+(i-(len(lines)-1)/2)*size*1.4
            weight='600' if bold else '400'
            self.svg.append(f'<text x="{x}" y="{yy}" font-family="Microsoft YaHei,Noto Sans CJK SC,sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}" text-anchor="{anchor}" dominant-baseline="central">{escape(t)}</text>')
            pa={'middle':'mm','start':'lm','end':'rm'}[anchor]
            self.draw.text((round(x*SCALE),round(yy*SCALE)),t,font=f,fill=color,anchor=pa,stroke_width=0)

    def node(self,x,y,w,h,title,body,fill=PALE):
        self.rect(x,y,w,h,fill=fill)
        self.text(x+w/2,y+15,title,10.6,bold=True)
        self.text(x+w/2,y+36,body,9.2)

    def save(self,name):
        self.svg.append('</svg>')
        (OUT/(name+'.svg')).write_text('\n'.join(self.svg),encoding='utf-8')
        self.image.save(OUT/(name+'.png'),dpi=(300,300))

def mindmap():
    d=Diagram(258)
    d.text(W/2,15,'从屏障机制理解日常护肤',12,bold=True)
    for y in [45,111,177]:
        d.line([(190,140),(178,140),(178,y+28),(163,y+28)],TEAL)
        d.line([(320,140),(334,140),(334,y+28),(347,y+28)],TEAL)
    d.rect(190,112,130,56,fill='#dcebee',stroke=TEAL)
    d.text(255,140,'护肤是否有利于\n屏障稳定？',11.6,bold=True)
    d.node(12,45,151,56,'皮肤屏障','角质细胞 · 脂质 · NMF')
    d.node(12,111,151,56,'过度清洁','强力去油 · 反复揉搓')
    d.node(12,177,151,56,'保湿','吸湿与减少蒸发相结合')
    d.node(347,45,151,56,'护肤误区','紧绷不等于干净\n油光不等于含水充足',SAND)
    d.node(347,111,151,56,'科学护肤建议','温和清洁 · 按需保湿 · 防晒')
    d.node(347,177,151,56,'课堂知识与生活实际','联系肤质、环境与反应')
    d.text(W/2,247,'观察需要与耐受，减少无必要的刺激',9.2,color=GRAY)
    d.save('figure1_mindmap')

def barrier():
    d=Diagram(288)
    d.text(W/2,15,'皮肤屏障结构与水分流失',12,bold=True)
    d.rect(65,95,279,120,fill='#e9e5dc',stroke='#c6c1b6',radius=0)
    d.rect(65,76,279,10,fill='#e5d9c4',stroke='#b9a889',radius=0)
    for row in range(3):
        offset=16 if row==1 else 0
        for col in range(3):
            d.rect(70+88*col+offset,102+36*row,78,27,fill='#edf3f3',stroke='#8ba2a7',radius=3)
    d.line([(54,95),(46,95),(46,215),(54,215)],GRAY,1)
    d.text(25,155,'角质层',10.2)
    for x,y in [(183,185),(196,188),(208,182),(215,194)]: d.circle(x,y,2.6)
    d.arrow([(153,238),(153,170),(169,170),(169,134),(153,134),(153,40)],TEAL,1.6)
    d.text(181,42,'经表皮水分流失（TEWL）',10.4,anchor='start',color=TEAL,bold=True)
    d.text(181,58,'正常存在；屏障受扰时可增加',9.1,anchor='start',color=GRAY)
    d.line([(326,80),(351,80),(351,92)],GRAY)
    d.text(359,80,'皮脂膜',10.4,anchor='start',bold=True)
    d.text(359,95,'位于角质层表面',9.1,anchor='start')
    d.line([(316,116),(350,116),(350,126)],GRAY)
    d.text(359,120,'角质细胞（砖）',10.4,anchor='start',bold=True)
    d.text(359,136,'扁平、交错排列',9.1,anchor='start')
    d.line([(335,170),(350,170),(350,166)],GRAY)
    d.text(359,163,'细胞间脂质（灰浆）',10.2,anchor='start',bold=True)
    d.text(359,179,'神经酰胺、胆固醇等',9.1,anchor='start')
    d.line([(215,194),(253,225),(351,225),(351,212)],GRAY)
    d.text(359,207,'天然保湿因子（NMF）',10,anchor='start',bold=True)
    d.text(359,223,'位于角质细胞内，帮助保水',8.7,anchor='start')
    d.text(260,241,'皮肤深层',9.1,color=GRAY)
    d.text(W/2,260,'皮脂膜、NMF与细胞间脂质各有作用',10.1)
    d.text(W/2,280,'示意图，不按比例；箭头仅表示扩散方向，不表示流失量。',8.9,color=GRAY)
    d.save('figure2_skin_barrier')

def advice():
    d=Diagram(297)
    d.text(W/2,15,'常见护肤误区与科学建议',12,bold=True)
    d.text(121,38,'需要警惕的做法',10.7,bold=True)
    d.text(389,38,'可采用的调整',10.7,bold=True)
    rows=[
        ('过度清洁','反复去油、揉搓','温和清洁','按出汗、残留与耐受调整'),
        ('频繁去角质','每天磨砂、加速更新','适度护肤','干燥、刺痛时减少刺激'),
        ('盲目叠加产品','同时尝试多种新品','按肤质和部位选用','减少同时引入的新产品'),
        ('只补水不保湿','把暂时湿润当作持续保湿','兼顾水合与减少失水','按需使用耐受的乳液或面霜'),
        ('忽视防晒','把保湿当作全面防护','重视防晒','结合遮阳、衣帽与防晒霜'),
    ]
    for i,(a,b,c,e) in enumerate(rows):
        y=51+i*43
        d.rect(18,y,205,37,fill=SAND)
        d.rect(287,y,205,37,fill=PALE)
        d.text(120.5,y+12,a,10.8,bold=True)
        d.text(120.5,y+27,b,9.1)
        d.text(389.5,y+12,c,10.8,bold=True)
        d.text(389.5,y+27,e,9.1)
        d.arrow([(242,y+18),(269,y+18)],TEAL,1)
    d.text(W/2,284,'持续或反复不适应就诊；日常护肤不能替代疾病诊疗。',9.1,color=GRAY)
    d.save('figure3_skincare_advice')

if __name__=='__main__':
    mindmap(); barrier(); advice()
    print('Saved three PNGs (300 dpi) and three editable SVGs.')
