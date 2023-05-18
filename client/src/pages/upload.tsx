/** @format */

import Head from 'next/head';
import Feeder from '../components/Feeder';
import Sidebar from '../components/menues/Sidebar';
import Widgets from '../components/Widgets';
import { FormEventHandler, useEffect } from 'react';
import { useAuthState } from '../context/auth';
import router from 'next/router';
import axios from 'axios';

export default function Upload() {
	const { user } = useAuthState();
    
    const submitFiles = async (e: any) => {
        e.preventDefault();
        console.log(e);
    }

	return (
		<div>
			<Head>
				<title>SSO ABE</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
				<Feeder>
                    <h1>File uploader</h1>
                    <form id="uploadForm" encType='multipart/form-data' onSubmit={submitFiles}>
                        <input type="file" id="myFiles" accept="image/*" multiple />
                        <button>Submit</button>
                    </form>
				</Feeder>
			</main>
		</div>
	);
}