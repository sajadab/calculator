import './calculator/style/App.scss';
import './calculator/style/theme.scss';
import 'bootstrap/dist/css/bootstrap.min.css'
import React from "react";

import type { AppProps } from 'next/app';
import Head from "next/head";

const MyApp = ({ Component, pageProps }: AppProps) => (
    <>
        <Head>
            <title>ماشین حساب</title>
            <meta name="description" content="ماشین حساب"/>
        </Head>
        <Component {...pageProps} />
    </>
);

export default MyApp;