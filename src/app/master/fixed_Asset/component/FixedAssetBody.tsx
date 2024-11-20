import { useListFixedAsset } from '../core/FixedAssetProvider';
import { debounce } from 'lodash';
import FullWidthTextField from '../../../../components/MUI/FullWidthTextField';
import AutocompleteComboBox from '../../../../components/MUI/AutocompleteComboBox';

interface FixedAssetBodyProps {
    onDataChange?: (data: any) => void;
    defaultValues?: {
        id: string;
        fixedAssetCode?: string;
        description?: string;
        costCenterId: string;
        fixedAssetStatus?: string;
    };
    options?: {
        costCenter: any[];
        serviceCenter: any[];
        costAndServiceCenters: any[];
        fixedAssetStatus: any[];
    };
    disableOnly?: boolean;
    actions?: string;
}

export default function FixedAssetBody({
    onDataChange,
    disableOnly,
    actions
}: FixedAssetBodyProps) {

    const {
        options,
        fixedAssetCode,
        setFixedAssetCode,
        description,
        setDescription,
        costcenterId,
        setCostcenterId,
        fixedAssetStatus,
        setFixedAssetStatus,
        isValidate,
        setIsValidate,
    } = useListFixedAsset();

    const debouncedOnDataChange = debounce((data: any) => {
        if (typeof onDataChange === 'function') {
            onDataChange(data);
        }
    }, 300);

    return (
        <div>
            <div className='row justify-start'>
                <div className='col-md-6 mb-2'>
                    <FullWidthTextField
                        required={"required"}
                        labelName={"Fixed Asset Code"}
                        value={fixedAssetCode}
                        disabled={actions === "Update" ? true : disableOnly}
                        onChange={(value) => setFixedAssetCode(value)}
                        Validate={isValidate?.fixed_asset_code}
                    />
                </div>
                <div className='col-md-6 mb-2'>
                    <FullWidthTextField
                        required={"required"}
                        labelName={"รายละเอียด"}
                        value={description}
                        disabled={actions === "Create" || actions === "Update" ? false : disableOnly}
                        onChange={(value) => setDescription(value)}
                        Validate={isValidate?.description}
                    />
                </div>
                <div className='col-md-6 mb-2'>
                    <AutocompleteComboBox
                        required={"required"}
                        labelName={"Cost Center & Service Center"}
                        description={"กรุณาพิมพ์คำว่า Service Center หากต้องการค้นหา."}
                        value={costcenterId}
                        disabled={actions === "Create" || actions === "Update" ? false : disableOnly}
                        setvalue={(data) => {
                            setCostcenterId(data);
                        }}
                        options={options?.costAndServiceCenters || []}
                        column="costCentersCodeAndName"
                        Validate={isValidate?.cost_center_id}
                    />
                </div>
                <div className='col-md-6 mb-2'>
                    <FullWidthTextField
                        required={"required"}
                        labelName={"Fixed Asset Status"}
                        value={fixedAssetStatus}
                        disabled={actions === "Create" || actions === "Update" ? false : disableOnly}
                        onChange={(value) => setFixedAssetStatus(value)}
                        Validate={isValidate?.fixed_asset_status}
                    />
                </div>
            </div>
        </div>
    );
}