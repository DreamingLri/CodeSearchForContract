function format_tag(tag: string): string {
    switch (tag) {
        case 'info': return 'primary';
        case 'warning': return 'warning';
        case 'error': return 'danger';
        default: return 'info';
    }
}

export default format_tag;