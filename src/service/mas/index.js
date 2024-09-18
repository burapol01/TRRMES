import axios from "axios";
export async function _GET(datasend, path) {
    const url = `${import.meta.env.VITE_APP_TRR_API_URL}${path}`;
    const datasent = {
        data: datasend,
    };
    try {
        const res = await axios.post(url, datasent);
        const data = res.data;
        if (data && data.status == "success") {
            return data.data;
        }
    }
    catch {
        return false;
    }
}
export async function _GET_SCSS(datasend, path) {
    const url = `${import.meta.env.VITE_APP_TRR_API_URL_SCSS}${path}`;
    const datasent = {
        data: datasend,
    };
    try {
        const res = await axios.post(url, datasent);
        const data = res.data;
        if (data && data.status == "success") {
            return data.data;
        }
    }
    catch {
        return false;
    }
}
export async function _POST(datasend, path) {
    const url = `${import.meta.env.VITE_APP_TRR_API_URL}${path}`;
    const datasent = {
        ...datasend,
    };
    try {
        const res = await axios.post(url, datasent);
        const data = res.data;
        if (data && data.status == "success") {
            return data;
        }
    }
    catch {
        return false;
    }
}
