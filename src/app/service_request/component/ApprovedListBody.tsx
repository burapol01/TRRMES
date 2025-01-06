import React from 'react';
import { useEffect, useState } from 'react';
import FullWidthTextField from '../../../components/MUI/FullWidthTextField';


interface ApprovedListBodyProps {
    onDataChange?: (data: any) => void;
    disableOnly?: boolean;
    actions?: string;
}

export default function ApprovedListBody({
}: ApprovedListBodyProps) {

    //เขียน Call API ที่นี่ได้เลย

    return (
        <div>
            <div className="row justify-start">
                <div className="col-md-3 mb-2">
                    <FullWidthTextField
                        labelName={"เลขที่ใบคำขอ"}
                        value={""}
                        //onChange={(value) => setRequestNo(value)}
                    />
                </div>           
            </div>
        </div>
    )
}
