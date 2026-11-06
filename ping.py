import httpx
try:
    r = httpx.get("https://api.midra.xyz/api/auth/status", timeout=15.0)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text[:200]}")
except Exception as e:
    print(f"❌ Server is completely down: {e}")
