export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;

export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

export function normalizeUsername(username: string) {
    return username.trim().toLowerCase();
}

export function generateVerifyCode(length = OTP_LENGTH) {
    let code = "";

    for (let index = 0; index < length; index += 1) {
        code += Math.floor(Math.random() * 10).toString();
    }

    return code;
}

export function getVerifyCodeExpiry() {
    return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

export function isVerifyCodeExpired(expiry?: Date | null) {
    if (!expiry) {
        return true;
    }

    return expiry.getTime() < Date.now();
}