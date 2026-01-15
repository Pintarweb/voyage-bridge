---
description: Automatic Version Bump on Push
---

# Automatic Version Bump Workflow

This workflow ensures that the project version is incremented with every push to the repository.

1.  **Read Package JSON**: Read `package.json` to get the current version.
2.  **Increment Version**: Increment the patch version (e.g., 0.1.0 -> 0.1.1). If it's a major/minor feature, verify with the user if they want a larger bump, otherwise default to patch.
3.  **Update File**: Use `replace_file_content` to update the version string in `package.json`.
4.  **Git Process**:
    *   Add `package.json` to the staging area: `git add package.json`.
    *   If there are other changes, include them in the commit.
    *   If this is a standalone bump, commit with: `git commit -m "Bump version to [new_version]"`.
    *   Push changes: `git push`.

**Trigger**: This workflow triggers whenever the user asks to "push" changes or explicitly mentions updating the version/deployment.
