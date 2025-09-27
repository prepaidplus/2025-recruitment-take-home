const crypto = require("crypto");

const config = { hashingSecret: "thisIsASecret" };

export const encryptString = (text, secret = config.hashingSecret) => {
    const iv = crypto.randomBytes(16);
    const key = crypto.createHash("sha256").update(secret).digest();
    
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    return iv.toString('base64') + ':' + encrypted;
};

export const decryptString = (encryptedString, secret = config.hashingSecret) => {
    if (typeof encryptedString === "string" && encryptedString.includes(":")) {
        const [ivBase64, encryptedData] = encryptedString.split(":");
        const iv = Buffer.from(ivBase64, "base64");
        const key = crypto.createHash("sha256").update(secret).digest();

        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

        let decrypted = decipher.update(encryptedData, "base64", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    } else {
        return false;
    }
};