import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold">MovieRecommend</h2>
                        <p className="mt-2">Discover your next favorite film</p>
                    </div>
                    <div className="text-center md:text-right">
                        <p>&copy; {new Date().getFullYear()} AML Lab Project</p>
                        <p>Built with COSINE Algorithm</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;