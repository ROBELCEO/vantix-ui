with open("competitors.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Make the modal taller and wider
# Replacing the inline style of the modal container
old_style = 'width: 100%; max-width: 1100px; max-height: 90vh; display: flex; flex-direction: column; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);'
new_style = 'width: 95vw; max-width: 1400px; height: 90vh; display: flex; flex-direction: column; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);'

html = html.replace(old_style, new_style)

# 2. Inject the aggressive scrollbar fix
scrollbar_fix = """
    <!-- ULTIMATE SCROLLBAR FIX -->
    <style>
        /* Force the scrollbar track to be light gray instead of black */
        #cmp-modal-body {
            scrollbar-width: thin !important;
            scrollbar-color: #D4D4D8 #F8FAFC !important; /* thumb track */
        }
        
        #cmp-modal-body::-webkit-scrollbar {
            width: 8px !important;
            background: #F8FAFC !important;
        }
        #cmp-modal-body::-webkit-scrollbar-track {
            background: #F8FAFC !important; /* Light gray track */
            border-left: 1px solid #E4E4E7 !important;
        }
        #cmp-modal-body::-webkit-scrollbar-thumb {
            background: #D4D4D8 !important;
            border-radius: 4px !important;
        }
        #cmp-modal-body::-webkit-scrollbar-thumb:hover {
            background: #A1A1AA !important;
        }
    </style>
"""

if "ULTIMATE SCROLLBAR FIX" not in html:
    html = html.replace("</head>", scrollbar_fix + "\n</head>")

with open("competitors.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Modal made taller, wider, and scrollbar fixed.")
