import axios from "axios";

export async function _POST(datasend: any, path: string) {
    const url = `${import.meta.env.VITE_APP_TRR_API_URL
        }${path}`;
    const datasent = {
        ...datasend,
    };

    try {
        const res = await axios.post(url, datasent);
        const data = res.data;
        return data;
    } catch {
        return false;
    }
}
export async function _GET(path: string) {
    const url = `${import.meta.env.VITE_APP_TRR_API_URL
        }${path}`;
   
    try {
        const res = await axios.get(url);
        const data = res.data;
        return data;
    } catch {
        return false;
    }
}