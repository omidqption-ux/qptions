export function formatPhoneNumber(phone) {
    return '+' + phone.replace(/[()]/g, '');
}