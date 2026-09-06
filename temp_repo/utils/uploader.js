import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';

export async function uploadImage(buffer) {
    try {
        const formData = new FormData();
        formData.append('file', buffer, 'image.jpg');
        
        const response = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data && data[0] && data[0].src) {
                return 'https://telegra.ph' + data[0].src;
            }
        }
    } catch (e) {}

    try {
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', buffer, 'image.jpg');

        const response = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const text = await response.text();
            if (text.startsWith('https://')) return text;
        }
    } catch (e) {}

    try {
        const formData = new FormData();
        formData.append('file', buffer, 'image.jpg');

        const response = await fetch('https://tmpfiles.org/api/v1/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.data && data.data.url) {
                return data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
            }
        }
    } catch (e) {}

    throw new Error("Failed to upload image via all fallbacks");
}
