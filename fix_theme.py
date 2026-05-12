import os, glob

for ext in ('*.html', '*/*.html'):
    for filepath in glob.glob(ext):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        updated = False
        if 'localStorage.setItem' not in content and 'function setTheme' in content:
            content = content.replace('document.body.classList.add("night");', 'document.body.classList.add("night"); localStorage.setItem("theme", "night");')
            content = content.replace('document.body.classList.remove("night");', 'document.body.classList.remove("night"); localStorage.setItem("theme", "day");')
            content = content.replace("document.body.classList.add('night');", "document.body.classList.add('night'); localStorage.setItem('theme', 'night');")
            content = content.replace("document.body.classList.remove('night');", "document.body.classList.remove('night'); localStorage.setItem('theme', 'day');")
            updated = True
        
        # Avoid multiple injections
        if '<script>if(localStorage.getItem("theme") === "night") { document.body.classList.add("night"); }</script></body>' not in content:
            content = content.replace('</body>', '<script>if(localStorage.getItem("theme") === "night") { document.body.classList.add("night"); }</script></body>')
            updated = True
            
        if updated:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print("Updated", filepath)
