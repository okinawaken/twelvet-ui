import Footer from '@/components/Footer';
import { SelectLang } from '@/components/RightContent';
import { CheckCircleFilled, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Helmet, history, useIntl, useModel } from '@umijs/max';
import { Alert, Button, Checkbox, Form, Input, message } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import { setAuthority } from '@/utils/twelvet';
import Settings from '../../../config/defaultSettings';
import { login } from './service';

const useStyles = createStyles(({ token }) => {
    return {
        page: {
            display: 'flex',
            minHeight: '100vh',
            background: token.colorBgLayout,
            color: token.colorText,
        },
        brandPane: {
            position: 'relative',
            display: 'flex',
            flex: '0 0 46%',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: '64px 56px',
            color: '#fff',
            background:
                'radial-gradient(120% 100% at 12% 0%, rgba(64, 128, 255, 0.55) 0%, rgba(10, 23, 48, 0) 55%),' +
                ' linear-gradient(160deg, #0A1730 0%, #0F2A5C 55%, #143E9B 100%)',
            '@media (max-width: 768px)': {
                display: 'none',
            },
        },
        brandInner: {
            maxWidth: 460,
        },
        brandName: {
            margin: '0 0 12px',
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '0.5px',
            color: '#fff',
        },
        brandTagline: {
            margin: 0,
            fontSize: 15,
            lineHeight: 1.7,
            color: 'rgba(255, 255, 255, 0.72)',
        },
        featureList: {
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            margin: '40px 0 0',
            padding: 0,
            listStyle: 'none',
        },
        featureItem: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            fontSize: 14,
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.86)',
        },
        featureIcon: {
            marginTop: 2,
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.92)',
        },
        formPane: {
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            minWidth: 0,
            padding: 24,
        },
        card: {
            width: '100%',
            maxWidth: 400,
            margin: 'auto',
            padding: '40px 36px 32px',
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowTertiary,
            '@media (max-width: 768px)': {
                maxWidth: '100%',
                padding: '8px 4px 24px',
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
            },
        },
        mobileBrand: {
            display: 'none',
            alignItems: 'center',
            gap: 12,
            marginBottom: 28,
            '@media (max-width: 768px)': {
                display: 'flex',
            },
        },
        mobileName: {
            fontSize: 20,
            fontWeight: 600,
            color: token.colorTextHeading,
        },
        formHeader: {
            marginBottom: 28,
        },
        formTitle: {
            margin: '0 0 8px',
            fontSize: 26,
            fontWeight: 600,
            lineHeight: 1.35,
            color: token.colorTextHeading,
        },
        formSubTitle: {
            margin: 0,
            fontSize: 14,
            color: token.colorTextSecondary,
        },
        alert: {
            marginBottom: 20,
        },
        form: {
            '.ant-form-item': {
                marginBottom: 20,
            },
            '.ant-form-item-explain-error': {
                fontSize: 12,
            },
        },
        extra: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
        },
        submit: {
            height: 44,
            fontSize: 15,
            fontWeight: 500,
        },
        footer: {
            padding: '8px 0',
            textAlign: 'center',
            fontSize: 12,
            color: token.colorTextTertiary,
            '.ant-pro-global-footer': {
                margin: 0,
                padding: 0,
            },
        },
        lang: {
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 10,
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: token.borderRadius,
            color: token.colorTextSecondary,
            '&:hover': {
                backgroundColor: token.colorBgTextHover,
            },
        },
    };
});

const FEATURES = [
    {
        id: 'pages.login.feature.microservice',
        defaultMessage: '开箱即用的微服务管理后台',
    },
    {
        id: 'pages.login.feature.permission',
        defaultMessage: '统一的认证与细粒度权限控制',
    },
    {
        id: 'pages.login.feature.develop',
        defaultMessage: '代码生成与多语言支持',
    },
];

const Lang = () => {
    const { styles } = useStyles();

    return (
        <div className={styles.lang} data-lang>
            <SelectLang />
        </div>
    );
};

const Login: React.FC = () => {
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { initialState, setInitialState } = useModel('@@initialState');
    const { styles } = useStyles();
    const intl = useIntl();

    const fetchUserInfo = async () => {
        const userInfo = await initialState?.fetchUserInfo?.();
        if (userInfo) {
            flushSync(() => {
                setInitialState((s) => ({
                    ...s,
                    // 用户信息
                    currentUser: {
                        user: userInfo.user,
                        menus: userInfo.menus,
                        permissions: userInfo.permissions,
                        roles: userInfo.roles,
                    },
                }));
            });
        }
    };

    const handleSubmit = async (values: API.LoginParams) => {
        setErrorMsg('');
        setLoading(true);
        try {
            // 仅支持账号密码登录
            const data = await login({ ...values, grantType: 'password', type: 'account' });
            if (data.code === 200) {
                setAuthority(data);

                message.success(
                    intl.formatMessage({
                        id: 'pages.login.success',
                        defaultMessage: '登录成功！',
                    }),
                );

                // 进行获取账号信息
                await fetchUserInfo();

                /** 此方法会跳转到 redirect 参数所在的位置 */
                const urlParams = new URL(window.location.href).searchParams;
                history.push(urlParams.get('redirect') || '/');
                return;
            }

            setErrorMsg(
                data.msg ||
                    intl.formatMessage({
                        id: 'pages.login.failure',
                        defaultMessage: '登录失败，请重试！',
                    }),
            );
        } catch (error) {
            setErrorMsg(
                intl.formatMessage({
                    id: 'pages.login.failure',
                    defaultMessage: '登录失败，请重试！',
                }),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <Helmet>
                <title>
                    {intl.formatMessage({
                        id: 'menu.login',
                        defaultMessage: '登录页',
                    })}
                    - {Settings.title}
                </title>
            </Helmet>
            <Lang />

            <aside className={styles.brandPane}>
                <div className={styles.brandInner}>
                    <h1 className={styles.brandName}>TwelveT 微服务</h1>
                    <p className={styles.brandTagline}>
                        {intl.formatMessage({
                            id: 'pages.login.brandTagline',
                            defaultMessage: '一站式微服务管理平台',
                        })}
                    </p>
                    <ul className={styles.featureList}>
                        {FEATURES.map((feature) => (
                            <li key={feature.id} className={styles.featureItem}>
                                <CheckCircleFilled className={styles.featureIcon} />
                                <span>
                                    {intl.formatMessage({
                                        id: feature.id,
                                        defaultMessage: feature.defaultMessage,
                                    })}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            <main className={styles.formPane}>
                <div className={styles.card}>
                    <div className={styles.mobileBrand}>
                        <span className={styles.mobileName}>TwelveT 微服务</span>
                    </div>

                    <header className={styles.formHeader}>
                        <h2 className={styles.formTitle}>
                            {intl.formatMessage({
                                id: 'pages.login.welcomeBack',
                                defaultMessage: '欢迎回来',
                            })}
                        </h2>
                        <p className={styles.formSubTitle}>
                            {intl.formatMessage({
                                id: 'pages.login.accountLogin.tab',
                                defaultMessage: '账户密码登录',
                            })}
                        </p>
                    </header>

                    {errorMsg && (
                        <Alert className={styles.alert} type="error" showIcon message={errorMsg} />
                    )}

                    <Form
                        className={styles.form}
                        name="login"
                        size="large"
                        requiredMark={false}
                        initialValues={{ autoLogin: true }}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: intl.formatMessage({
                                        id: 'pages.login.username.required',
                                        defaultMessage: '请输入用户名！',
                                    }),
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder={intl.formatMessage({
                                    id: 'pages.login.username.placeholder',
                                    defaultMessage: '用户名',
                                })}
                                autoComplete="username"
                                allowClear
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: intl.formatMessage({
                                        id: 'pages.login.password.required',
                                        defaultMessage: '请输入密码！',
                                    }),
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder={intl.formatMessage({
                                    id: 'pages.login.password.placeholder',
                                    defaultMessage: '密码',
                                })}
                                autoComplete="current-password"
                            />
                        </Form.Item>

                        <div className={styles.extra}>
                            <Form.Item name="autoLogin" valuePropName="checked" noStyle>
                                <Checkbox>
                                    {intl.formatMessage({
                                        id: 'pages.login.rememberMe',
                                        defaultMessage: '自动登录',
                                    })}
                                </Checkbox>
                            </Form.Item>
                        </div>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                className={styles.submit}
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                            >
                                {intl.formatMessage({
                                    id: 'pages.login.submit',
                                    defaultMessage: '登录',
                                })}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                <div className={styles.footer}>
                    <Footer />
                </div>
            </main>
        </div>
    );
};

export default Login;
