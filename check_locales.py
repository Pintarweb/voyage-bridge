# Script to quickly check what languages are missing the new fields
import re

# Read the file
with open('src/app/supplier/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all locale blocks
locales = re.findall(r"'([a-z]{2}-[A-Z]{2})':\s*{", content)
print("Found locales:", locales)

# Check each for the new fields
for locale in locales:
    # Find the block for this locale
    pattern = rf"'{locale}':\s*{{([^}}]+(?:}}[^}}]+)*?)}},\s*'"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        block = match.group(1)
        has_in_location = 'in_location' in block
        has_categoryValues = 'categoryValues' in block
        has_statusValues = 'statusValues' in block
       
        print(f"\n{locale}:")
        print(f"  in_location: {has_in_location}")
        print(f"  categoryValues: {has_categoryValues}")
        print(f"  statusValues: {has_statusValues}")
