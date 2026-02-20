export function sanitizeHtml(input: string): string {
    const div = document.createElement('div');
    div.innerText = input;
    return div.innerHTML;
}

export function sanitizeInput(input: string): string {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}