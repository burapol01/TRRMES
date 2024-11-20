import { useListSite } from '../core/SiteProvider';
import { debounce } from 'lodash';
import FullWidthTextField from '../../../../components/MUI/FullWidthTextField';

interface SiteBodyProps {
    onDataChange?: (data: any) => void;
    defaultValues?: {
        id: string;
        siteCode: string;
        siteName?: string;
        domain?: string;
    };
    options?: {
        siteCode: any[];
        siteName: any[];
        domain: any[];
    };
    disableOnly?: boolean;
    actions?: string;
}

export default function SiteBody({
    onDataChange,
    disableOnly,
    actions
}: SiteBodyProps) {

    const {
        siteCode,
        setSiteCode,
        siteName,
        setSiteName,
        domain,
        setDomain,
        isValidate,
    } = useListSite();

    const debouncedOnDataChange = debounce((data: any) => {
        if (typeof onDataChange === 'function') {
            onDataChange(data);
        }
    }, 300);

    return (
        <div>
            <div className='row justify-start'>
                <div className='col-md-4 mb-2'>
                    <FullWidthTextField
                        required={"required"}
                        labelName={"Site"}               
                        value={siteCode}
                        disabled={actions === "Update" ? true : disableOnly}
                        onChange={(value) => setSiteCode(value)}
                        Validate={isValidate?.site_code}
                    />
                </div>
                <div className='col-md-4 mb-2'>
                    <FullWidthTextField
                        required={"required"}
                        labelName={"โรงงาน"}
                        value={siteName}
                        disabled={actions === "Create" || actions === "Update" ? false : disableOnly}
                        onChange={(value) => setSiteName(value)}
                        Validate={isValidate?.site_name}
                    />
                </div>
                <div className='col-md-4 mb-2'>
                    <FullWidthTextField
                        required={"required"}
                        labelName={"Domain"}
                        value={domain}
                        disabled={actions === "Create" || actions === "Update" ? false : disableOnly}
                        onChange={(value) => setDomain(value)}
                        Validate={isValidate?.domain}
                    />
                </div>
            </div>
        </div>
    );
}