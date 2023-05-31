module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    safelist: [
        'bg-red-500', 'bg-red-300', 'bg-orange-300', 'bg-yellow-300', 'bg-slate-500', 'border-slate-500',
        'border-red-500', 'border-red-300', 'border-orange-300', 'border-yellow-300', 'border-green-400',
        'bg-green-400', 'bg-red-400', 'bg-gray-400'],
    theme: {
        fontFamily:{
            body:['Fira Sans']
        },
        extend:{
            colors:{
                blue:{
                    100:'#ccdef0',
                    200:'#99bde0',
                    300:'#669cd1',
                    400:'#337bc1',
                    500:'#005ab2',
                    500:'#00488e',
                    40:'#00366b',
                    60:'#002447',
                    80:'#001224',
                }
            }
        }
    },
    plugins: [require('@tailwindcss/forms')],
};