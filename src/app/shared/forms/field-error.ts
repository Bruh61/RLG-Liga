/** Minimal view of a Signal Forms field state needed to surface its first error. */
export interface FieldErrorState {
  touched(): boolean;
  dirty(): boolean;
  errors(): readonly { message?: string }[];
}

/** First validation message for a field, once the user has interacted with it. */
export function firstError(state: FieldErrorState): string | null {
  if (!state.touched() && !state.dirty()) {
    return null;
  }
  return state.errors()[0]?.message ?? null;
}
