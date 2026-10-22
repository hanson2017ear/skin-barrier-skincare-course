"""Create an actual QR image for a GitHub repository URL.

Usage: python scripts/make_qr.py https://github.com/OWNER/REPOSITORY
Add --pending while the repository has not yet been published.
Dependencies: Pillow, reportlab
"""
from pathlib import Path
from urllib.parse import urlparse
import argparse, json, os
from PIL import Image, ImageDraw, ImageFont
from reportlab.graphics.barcode.qrencoder import QRCode, QRErrorCorrectLevel

def make_qr(url, root, pending=False):
    parsed=urlparse(url)
    if parsed.scheme!='https' or parsed.netloc.lower()!='github.com' or len(parsed.path.strip('/').split('/'))<2:
        raise ValueError('Use a complete HTTPS GitHub repository URL.')
    qr=QRCode(None, QRErrorCorrectLevel.M)
    qr.addData(url)
    qr.make()
    n=qr.getModuleCount()
    module=14
    border=4
    side=(n+border*2)*module
    im=Image.new('RGB',(side,side),'white')
    draw=ImageDraw.Draw(im)
    for row in range(n):
        for col in range(n):
            if qr.isDark(row,col):
                x=(col+border)*module; y=(row+border)*module
                draw.rectangle((x,y,x+module-1,y+module-1),fill='black')
    root=Path(root); root.mkdir(exist_ok=True,parents=True)
    im.save(root/'qr_github.png',dpi=(300,300))
    state={'url':url,'status':'pending_publication' if pending else 'user_supplied_url','repository_exists_verified':False,'encoding':'byte','error_correction':'M','quiet_zone_modules':border,'modules':n}
    (root/'qr_target.txt').write_text(url+'\n',encoding='utf-8')
    (root/'qr_status.json').write_text(json.dumps(state,ensure_ascii=False,indent=2),encoding='utf-8')
    return im,state

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('url')
    parser.add_argument('--pending',action='store_true')
    parser.add_argument('--output-dir',type=Path,default=Path(__file__).resolve().parents[1])
    args=parser.parse_args()
    _,state=make_qr(args.url,args.output_dir,args.pending)
    print(json.dumps(state,ensure_ascii=False))
