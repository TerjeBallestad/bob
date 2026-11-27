#!/usr/bin/env bash
# Install the packed package into an npm workspace (the app is a workspace, the
# package is hoisted to the root) and type-check a file that passes native props.
#
# This does NOT reproduce the 0.1.0 failure. There, Time Turtle's lockfile kept
# @types/react inside client/node_modules, out of reach of Bob's declarations,
# so ButtonProps lost every native attribute. A fresh install hoists
# @types/react anyway. The fix is the required peer on @types/react, which
# makes npm place it where Bob can see it, and Time Turtle's own typecheck is
# the test of that.
set -euo pipefail
root=$(cd "$(dirname "$0")/.." && pwd)
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

npm pack --silent --pack-destination "$work" >/dev/null
tgz=$(ls "$work"/*.tgz)

mkdir -p "$work/ws/app/src"
cat > "$work/ws/package.json" <<JSON
{ "name": "ws", "private": true, "workspaces": ["app"] }
JSON
cat > "$work/ws/app/package.json" <<JSON
{ "name": "app", "private": true, "type": "module",
  "dependencies": { "react": "18.3.1", "react-dom": "18.3.1", "@terjeballestad/bob": "file:$tgz" },
  "devDependencies": { "@types/react": "18.3.31", "@types/react-dom": "18.3.7", "typescript": "$(node -p "require('$root/package.json').devDependencies.typescript")" } }
JSON
cat > "$work/ws/app/tsconfig.json" <<'JSON'
{ "compilerOptions": { "target": "ES2022", "module": "ESNext", "moduleResolution": "bundler",
  "jsx": "react-jsx", "strict": true, "noEmit": true, "types": ["react", "react-dom"] },
  "include": ["src"] }
JSON
cat > "$work/ws/app/src/use.tsx" <<'TSX'
import {
  Button, Chip, FormRow, Input, Modal, SegToggle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  ToastStack, createToastManager, useToastManager, type ToastOptions,
} from '@terjeballestad/bob';
import { useState } from 'react';

export const toast = createToastManager();
const failed: ToastOptions = { title: 'Could not save', description: 'Try again', type: 'error', timeout: 0 };
export const id: string = toast.add(failed);

const stages = [{ value: 'inbox', label: 'Inbox' }, { value: 'done', label: 'Done' }];
function Stage() {
  const [stage, setStage] = useState('inbox');
  return (
    <FormRow label="Stage">
      <Select items={stages} value={stage} onValueChange={(v) => v !== null && setStage(v)} name="stage">
        <SelectTrigger className="w-40" aria-invalid={stage === 'done'} aria-describedby="stage-error">
          <SelectValue placeholder="None" />
        </SelectTrigger>
        <SelectContent>
          {stages.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </FormRow>
  );
}
function SaveButton() {
  const local = useToastManager();
  return <Button onClick={() => local.add({ title: 'Saved' })}>Save</Button>;
}
export const ok = (
  <>
    <Stage />
    <Button variant="ghost" onClick={() => {}} type="submit">Save</Button>
    <Chip mono tone="green" title="role">admin</Chip>
    <Input value="x" onChange={(e) => e.target.value} />
    <Modal open title="Archive?" onClose={() => {}} footer={<Button>Archive</Button>}>Body</Modal>
    <SegToggle options={['day', { value: 'week', label: 'Week' }]} value="day" onChange={(v: string) => v} />
    <ToastStack toastManager={toast} timeout={3000} limit={3}><SaveButton /></ToastStack>
  </>
);
TSX
(cd "$work/ws" && npm install --silent --no-audit --no-fund >/dev/null && cd app && npx tsc -p .)
# Modal, Select, SegToggle and ToastStack run on Base UI, Bob's runtime dependency. The type check above
# resolves its types; this resolves its code from the app, so a missing dependency fails here.
(cd "$work/ws/app" && node --input-type=module -e "await import('@base-ui/react/dialog'); await import('@base-ui/react/toggle-group'); await import('@base-ui/react/toast'); await import('@base-ui/react/select')")
echo "consumer check passed"
