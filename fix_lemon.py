import re

with open("js/membership.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Fix the suffix logic (change '?' to '&' because your new URLs have '?discount=0')
js = js.replace('?checkout[custom][user_id]=', '&checkout[custom][user_id]=')

# 2. Replace the URLs using a lambda to avoid PowerShell escaping issues with $
js = re.sub(
    r'const starterUrl = `[^`]+`;',
    lambda m: 'const starterUrl = `https://midra.lemonsqueezy.com/checkout/buy/d5f53e33-3d35-4cc5-aaca-3ca5a3236ed7?discount=0${suffix}`;',
    js
)
js = re.sub(
    r'const proUrl = `[^`]+`;',
    lambda m: 'const proUrl = `https://midra.lemonsqueezy.com/checkout/buy/422c4e93-6071-457c-90b6-a648c5dee4c4?discount=0${suffix}`;',
    js
)
js = re.sub(
    r'const scaleUrl = `[^`]+`;',
    lambda m: 'const scaleUrl = `https://midra.lemonsqueezy.com/checkout/buy/789d4ae0-cc01-462d-a074-78a360971168?discount=0${suffix}`;',
    js
)

with open("js/membership.js", "w", encoding="utf-8") as f:
    f.write(js)

print("✅ Successfully updated Lemon Squeezy URLs and Suffix logic.")
