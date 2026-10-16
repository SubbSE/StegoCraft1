// Passes an in-memory file from one page to another (for example from a challenge to the Detect lab)
// without uploading anything. The sender stashes the file and navigates with { state: { handoff: id } };
// the receiving page looks it up. Reading is side-effect free, so it is safe in render.

const stash = new Map();
let counter = 0;

export function handOff(item) {
  const id = `handoff-${++counter}`;
  stash.set(id, item);
  return id;
}

/** The item handed to this page, if any (and if it's of the expected kind). */
export function receive(state, kind) {
  const item = state?.handoff ? stash.get(state.handoff) : null;
  return item && item.kind === kind ? item : null;
}
