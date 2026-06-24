import os

frontend_dir = r"e:\Auto-tagging\frontend\app"

print("Fixing hardcoded API URLs to relative paths for unified deployment...")

for root, _, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            if "http://localhost:8000" in content:
                # Replace literal string concats
                content = content.replace('"http://localhost:8000/api/', '"/api/')
                # Replace template literals
                content = content.replace('`http://localhost:8000/api/', '`/api/')
                
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f" -> Updated {os.path.basename(path)}")

print("All done! You are ready to deploy.")
