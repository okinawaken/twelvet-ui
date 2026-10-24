import {PageContainer} from '@ant-design/pro-components'
import {useModel} from '@umijs/max'
import {createStyles} from 'antd-style'
import React from 'react'

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const useStyles = createStyles(({token}) => {
    return {
        hero: {
            position: 'relative',
            overflow: 'hidden',
            padding: '56px 48px',
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            '@media (max-width: 768px)': {
                padding: '32px 24px',
            },
        },
        accent: {
            position: 'absolute',
            top: -160,
            right: -160,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${token.colorPrimaryBg} 0%, transparent 70%)`,
            pointerEvents: 'none',
        },
        greeting: {
            position: 'relative',
            margin: 0,
            fontSize: 32,
            fontWeight: 600,
            lineHeight: 1.35,
            color: token.colorTextHeading,
            '@media (max-width: 768px)': {
                fontSize: 26,
            },
        },
        subtitle: {
            position: 'relative',
            margin: '12px 0 0',
            fontSize: 15,
            color: token.colorTextSecondary,
        },
        date: {
            position: 'relative',
            marginTop: 32,
            fontSize: 13,
            letterSpacing: '0.5px',
            color: token.colorTextTertiary,
        },
    }
})

/**
 * 首页
 */
const Index: React.FC = () => {
    const {initialState} = useModel('@@initialState')
    const {styles} = useStyles()

    const username = initialState?.currentUser?.user?.username

    const now = new Date()
    const hour = now.getHours()
    let greeting = '晚上好'
    if (hour < 6) {
        greeting = '夜深了'
    } else if (hour < 12) {
        greeting = '早上好'
    } else if (hour < 18) {
        greeting = '下午好'
    }

    return (
        <PageContainer>
            <div className={styles.hero}>
                <div className={styles.accent}/>
                <h1 className={styles.greeting}>
                    {greeting}
                    {username ? `，${username}` : ''}
                </h1>
                <p className={styles.subtitle}>欢迎使用 TwelveT 微服务 · 一站式微服务管理平台</p>
                <p className={styles.date}>
                    {`${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 ${WEEKDAYS[now.getDay()]}`}
                </p>
            </div>
        </PageContainer>
    )
}

export default Index
