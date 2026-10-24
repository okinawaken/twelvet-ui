import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <DefaultFooter
            style={{
                background: 'none',
                padding: 0,
            }}
            copyright={`${currentYear} TwelveT`}
        />
    );
};

export default Footer;
