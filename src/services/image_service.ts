import apiClient from "./api-client";

const uploadImage = (img: File) => {
    const formData = new FormData();
    formData.append("file", img);
    const request = apiClient.post('/file?file=' + img.name, formData, {
        headers: {
            'Content-Type': 'image/*'
        }
    });
    return { request };
}

const getImage = async (filename: string): Promise<string> => {
    const response = await apiClient.get(`/file/${filename}`, {
        responseType: 'blob'
    });
    const url = URL.createObjectURL(response.data);
    return url;
}
export default { uploadImage, getImage };