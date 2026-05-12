import os, glob, re

for ext in ('*.html', '*/*.html'):
    for filepath in glob.glob(ext):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        updated = False
        
        # 1. Fix ugly gradients in night mode
        bad_gradient = "linear-gradient(180deg, #333333 0%, #b3b3b3 100%)"
        if bad_gradient in content:
            content = content.replace(bad_gradient, "#111111")
            updated = True
            
        bad_gradient2 = "linear-gradient(180deg, #333333 0%, #b3b3b3 100%);"
        if bad_gradient2 in content:
            content = content.replace(bad_gradient2, "#111111;")
            updated = True

        # 2. Fix explicit color: #000 in night mode for cards/panels
        # dr_patients.html doing body.night .table-panel { color: #000; }
        if "body.night .priority-card { color: #000; }" in content:
            content = content.replace("body.night .priority-card { color: #000; }", "body.night .priority-card { color: #fff; }")
            updated = True
        
        if "body.night .table-panel { color: #000; }" in content:
            content = content.replace("body.night .table-panel { color: #000; }", "body.night .table-panel { color: var(--text); }")
            updated = True
            
        if "body.night .stat-card { color: #000; }" in content:
            content = content.replace("body.night .stat-card { color: #000; }", "body.night .stat-card { color: #fff; }")
            updated = True

        if updated:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print("Fixed CSS in", filepath)
