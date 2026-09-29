export function formatSuccess(data: unknown) {
  return { success: true, data };
}

export function formatError(message: string) {
  return { success: false, error: message };
}
