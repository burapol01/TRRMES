import "dayjs/locale/th";
import Dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
Dayjs.extend(buddhistEra);
export default class OverwriteAdapterDayjs extends AdapterDayjs {
    constructor({ locale, formats, instance }) {
        super({ locale, formats, instance });
        Object.defineProperty(this, "formatByString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (date, format) => {
                if (format === "YYYY") {
                    format = "BBBB";
                }
                return this.dayjs(date).format(format);
            }
        });
    }
}
