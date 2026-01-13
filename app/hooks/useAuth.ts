/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const login = async (phone: string, password: string) => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.post('https://ems-backend-sigma.vercel.app/api/auth/login', { phone, password });

			// টোকেন এবং ইউজার ডাটা লোকাল স্টোরেজে সেভ করা
			localStorage.setItem('user', JSON.stringify(response.data));

			const userRole = response.data.role;

			// --- ROLE BASED REDIRECTION SYSTEM ---
			// ইউজারের রোল অনুযায়ী আলাদা আলাদা পাথে রিডাইরেক্ট করা
			switch (userRole) {
				case 'Admin':
					router.push('/dashboard/admin');
					break;
				case 'HR':
					router.push('/dashboard/hr');
					break;
				case 'Manager':
					router.push('/dashboard/manager');
					break;
				case 'Employee':
					router.push('/dashboard/employee');
					break;
				default:
					// যদি কোনো রোল না মিলে তবে জেনারেল ড্যাশবোর্ডে যাবে
					router.push('/');
					break;
			}

		} catch (err: any) {
			setError(err.response?.data?.message || 'Login failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return { login, loading, error };
}