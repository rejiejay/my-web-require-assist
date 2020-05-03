import CryptoJS from 'crypto-js';

/**
 * AES-128-CBC-PKCS7Padding 对称加密
 * @param encryptData 待加密内容
 * @param sKey aesKey 32 字节的AES密钥
 * @param ivParameter 初始化向量 16 字节的初始化向量
 * @return 返回经 BASE64 处理之后的密文
 */
export const AES128CBCPKCS7Padding = (encryptData, sKey, ivParameter) => {
    const content = CryptoJS.enc.Utf8.parse(encryptData);
    const aesKey = CryptoJS.enc.Utf8.parse(sKey);
    const iv = CryptoJS.enc.Utf8.parse(ivParameter);

    // 加密
    const encrypted = CryptoJS.AES.encrypt(content, aesKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

/**
 * 数字签名加密
 * @param reqParam 请求体
 * @param username 需要加密的用户名称
 * @param token 加密所需的凭证
 */
export const encryp = (reqParam, username, token) => {
    const encrypt = { username, token };
    const encryptStr = JSON.stringify(encrypt);


    let bodyMd5 = CryptoJS.MD5(reqParam).toString(); // md5加密 小写


    if (bodyMd5.length < 32) { // 因为字符串需要 32 位 ，但是 MD5加密也有不满32位的情况，所以这里我们手动填充
        const diff = 32 - bodyMd5.length;
        for (let i = 0; i < diff; i++) {
            bodyMd5 += '0';
        }
    }

    const sKey = bodyMd5.substring(0, 32); // 密钥key 32 字节的AES密钥
    const ivParameter = bodyMd5.substring(bodyMd5.length - 16); // 向量 也是16位

    return AES128CBCPKCS7Padding(encryptStr, sKey, ivParameter);
}