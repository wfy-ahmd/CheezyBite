import AdminProvider from '../context/AdminContext';
import AdminLayout from '../components/AdminLayout';

export const metadata = {
    title: 'CheezyBite Admin',
    description: 'Admin dashboard for CheezyBite pizza ordering app',
};

export default function AdminRootLayout({ children }) {
    return (
        <AdminProvider>
            <AdminLayout>
                {children}
            </AdminLayout>
        </AdminProvider>
    );
}
