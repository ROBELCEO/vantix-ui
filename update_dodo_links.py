import re

with open("js/membership.js", "r", encoding="utf-8") as f:
    js = f.read()

# Your exact Dodo Payment Links
dodo_starter = "https://checkout.dodopayments.com/buy/pdt_0NrCXAoNxY19PE0XvdDJo?quantity=1"
dodo_pro = "https://checkout.dodopayments.com/buy/pdt_0NrCXc9Ef8mEhTFfwG7nI?quantity=1"
dodo_scale = "https://checkout.dodopayments.com/buy/pdt_0NrCXtG1gU1wbKwmua7uz?quantity=1"

# We append the user_id and redirect_url using '&' because your links already have '?quantity=1'
new_suffix = 'const suffix = userId ? `&metadata_user_id=${userId}&redirect_url=https://midra.xyz/membership.html` : \'&redirect_url=https://midra.xyz/membership.html\';'

# Replace the old suffix logic
js = re.sub(r'const suffix = .*?;', new_suffix, js, count=1)

# Replace the URLs
js = re.sub(r'const starterUrl = `[^`]+`;', f'const starterUrl = `{dodo_starter}${{suffix}}`;', js)
js = re.sub(r'const proUrl = `[^`]+`;', f'const proUrl = `{dodo_pro}${{suffix}}`;', js)
js = re.sub(r'const scaleUrl = `[^`]+`;', f'const scaleUrl = `{dodo_scale}${{suffix}}`;', js)

with open("js/membership.js", "w", encoding="utf-8") as f:
    f.write(js)

print("✅ Successfully updated membership.js with your Dodo Links!")
