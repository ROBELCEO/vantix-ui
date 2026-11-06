import re

with open("js/discovery.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Update Discovery Cards Image
old_discovery_img = """<img src="${item.image_url || 'https://ui-avatars.com/api/?name=V&background=F4F4F5'}" style="width:100%; height:100%; object-fit:cover;">"""
new_discovery_img = """<img src="${item.image_url ? 'https://images.weserv.nl/?url=' + encodeURIComponent(item.image_url) : 'https://ui-avatars.com/api/?name=V&background=F4F4F5'}" onerror="this.onerror=null; this.src='https://placehold.co/300x300?text=Image+Not+Found';" style="width:100%; height:100%; object-fit:cover;">"""

if old_discovery_img in js:
    js = js.replace(old_discovery_img, new_discovery_img)
    print("✅ Patched Discovery Card images.")
else:
    print("⚠️ Could not find Discovery Card image tag.")

# 2. Update Watchlist Images
old_watchlist_img = """<img src="${item.image_url || 'https://ui-avatars.com/api/?name=V&background=F4F4F5'}" style="width:100%; height:200px; object-fit:cover; border-radius:4px; display:block;">"""
new_watchlist_img = """<img src="${item.image_url ? 'https://images.weserv.nl/?url=' + encodeURIComponent(item.image_url) : 'https://ui-avatars.com/api/?name=V&background=F4F4F5'}" onerror="this.onerror=null; this.src='https://placehold.co/300x300?text=Image+Not+Found';" style="width:100%; height:200px; object-fit:cover; border-radius:4px; display:block;">"""

if old_watchlist_img in js:
    js = js.replace(old_watchlist_img, new_watchlist_img)
    print("✅ Patched Watchlist images.")
else:
    print("⚠️ Could not find Watchlist image tag.")

with open("js/discovery.js", "w", encoding="utf-8") as f:
    f.write(js)

print("✅ Image proxy applied successfully.")
