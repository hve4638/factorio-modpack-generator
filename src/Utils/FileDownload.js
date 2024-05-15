
export function download(filename, blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.addEventListener('click', (e) => {
        setTimeout((_) => {
            window.URL.revokeObjectURL(url);
            a.remove();
        }, 60000);
    })
    document.body.appendChild(a);
    a.click();
}
