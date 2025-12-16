const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MIGRATIONS_DIR = 'supabase/migrations';

function run(cmd) {
    try {
        console.log(`Running: ${cmd}`);
        execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
        // ignore error for repair as it might not prevent next steps
        console.log(`Command failed (ignoring): ${cmd}`);
    }
}

async function fix() {
    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql'));

    // Group by short ID
    const grouped = {};
    for (const f of files) {
        const match = f.match(/^(\d{8})_/);
        if (match) {
            const id = match[1];
            if (!grouped[id]) grouped[id] = [];
            grouped[id].push(f);
        }
    }

    for (const id of Object.keys(grouped)) {
        console.log(`Processing short ID: ${id}`);

        // 1. Revert on remote
        run(`npx supabase migration repair --status reverted ${id}`);

        // 2. Rename files
        const fileList = grouped[id].sort(); // ensure deterministic order
        for (let i = 0; i < fileList.length; i++) {
            const oldName = fileList[i];
            const suffix = String(i).padStart(6, '0');
            const newId = `${id}${suffix}`;
            const newName = oldName.replace(`${id}_`, `${newId}_`);

            fs.renameSync(path.join(MIGRATIONS_DIR, oldName), path.join(MIGRATIONS_DIR, newName));
            console.log(`Renamed ${oldName} -> ${newName}`);
        }
    }

    // Also handle files that might have been partially fixed but still need referencing?
    // No, logic above covers all 8-digit starts.

    console.log('All fixed. Running push...');
    run('npx supabase db push --include-all');
}

fix();
