import glob
import re

files = glob.glob("*.html")
for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Force the hover state to have NO background
    content = re.sub(
        r'\.header \.tab:hover \{.*?\}',
        '.header .tab:hover {\n            background-color: transparent !important;\n            color: #FFFFFF !important;\n        }',
        content,
        flags=re.DOTALL
    )
    
    # 2. Force the active state to have NO background and a Cyan text color
    content = re.sub(
        r'\.header \.tab\.active \{.*?\}',
        '.header .tab.active {\n            background-color: transparent !important;\n            color: #00E5FF !important;\n            font-weight: 800 !important;\n        }',
        content,
        flags=re.DOTALL
    )

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Cleaned sidebar background in {file}")

print("\n✅ All done! The blue boxes are officially gone.")
