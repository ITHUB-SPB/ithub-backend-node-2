export function formatSuccess(data: unknown) {
    return { success: true, data: data }
}

export function formatError(message: string) {
    return { success: false, error: message }
}
