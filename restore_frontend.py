import os
import glob
import shutil

def restore_latest(pattern, target):
    backups = glob.glob(pattern)
    if not backups:
        print(f"❌ No backup found for {target}")
        return False
    
    latest_bak = max(backups, key=os.path.getmtime)
    shutil.copy2(latest_bak, target)
    print(f"✅ Restored {target} from {latest_bak}")
    return True

restore_latest("js/terminal.js.bak_*", "js/terminal.js")
# Check if terminal.html has a backup, otherwise we just rely on terminal.js
restore_latest("terminal.html.bak_*", "terminal.html")
